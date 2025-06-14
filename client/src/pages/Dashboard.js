import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [message, setMessage] = useState('');
  const [filterExercise, setFilterExercise] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSessions = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      setMessage('Please log in to view your sessions.');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.get(`http://localhost:5000/session/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
      setMessage('');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
      }
      setMessage(err.response?.data?.message || 'Failed to fetch sessions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    let data = [...sessions];

    if (filterExercise !== 'All') {
      data = data.filter((s) => s.exercise === filterExercise);
    }

    if (sortBy === 'date') {
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortBy === 'accuracy') {
      data.sort((a, b) => b.accuracy - a.accuracy);
    }

    setFiltered(data);
  }, [sessions, filterExercise, sortBy]);

  const uniqueExercises = ['All', ...new Set(sessions.map(s => s.exercise))];

  const downloadCSV = () => {
    const header = "Exercise,Feedback,Accuracy,Date\n";
    const rows = sessions.map(s => 
      `${s.exercise},${s.feedback},${s.accuracy},${new Date(s.timestamp).toLocaleString()}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "sessions.csv";
    link.click();
  };

  const avgAccuracy = (sessions.length > 0)
    ? (sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length).toFixed(1)
    : 0;

  const chartData = sessions.map((s) => ({
    name: new Date(s.timestamp).toLocaleDateString(),
    accuracy: s.accuracy
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">📊 Dashboard</h2>

      {message && (
        <p className="text-red-600 text-center mb-4">{message}</p>
      )}

      {sessions.length > 0 && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Sessions</h3>
              <p className="text-2xl font-bold">{sessions.length}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Average Accuracy</h3>
              <p className="text-2xl font-bold">{avgAccuracy}%</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Last Exercise</h3>
              <p className="text-xl font-medium">{sessions[0]?.exercise}</p>
            </div>
          </div>

          {/* Filter & Sort */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <div>
              <label className="mr-2 font-semibold">Filter:</label>
              <select
                value={filterExercise}
                onChange={(e) => setFilterExercise(e.target.value)}
                className="border px-2 py-1 rounded-md"
              >
                {uniqueExercises.map((ex, i) => (
                  <option key={i} value={ex}>{ex}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mr-2 font-semibold">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border px-2 py-1 rounded-md"
              >
                <option value="date">Date</option>
                <option value="accuracy">Accuracy</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchSessions}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Refresh
              </button>
              <button
                onClick={downloadCSV}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Download CSV
              </button>
            </div>
          </div>

          {/* Accuracy Chart */}
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Session List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((session) => (
              <div key={session._id} className="bg-white border rounded-lg p-4 shadow">
                <h4 className="text-lg font-semibold">{session.exercise}</h4>
                <p><strong>Feedback:</strong> {session.feedback}</p>
                <p><strong>Accuracy:</strong> {session.accuracy}%</p>
                <p><strong>Date:</strong> {new Date(session.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {sessions.length === 0 && !message && (
        <p className="text-center text-gray-600 mt-8">No sessions found.</p>
      )}
    </div>
  );
}

export default Dashboard;
