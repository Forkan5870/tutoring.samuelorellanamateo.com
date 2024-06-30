import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function StudentPortal() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [unpaidSessions, setUnpaidSessions] = useState([]);
  const [paidSessions, setPaidSessions] = useState([]);
  const [selectedSection, setSelectedSection] = useState('info'); // State to manage which section is displayed
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/students/${studentId}`);
        const data = await response.json();
        setStudent(data.student);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [studentId]);

  useEffect(() => {
    if (student) {
      const upcomingFilter = student.sessions.filter(session => !session.taken);
      const unpaidFilter = student.sessions.filter(session => session.taken && !session.paid);
      const paidFilter = student.sessions.filter(session => session.taken && session.paid);
      setUpcomingSessions(upcomingFilter);
      setUnpaidSessions(unpaidFilter);
      setPaidSessions(paidFilter);
    }
  }, [student]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onSelectSession = (event) => {
    setSelectedSessionId(event.target.value);
  };

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('studentId', studentId);
      formData.append('sessionId', selectedSessionId);
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/api/payment/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.text();
        console.log(data);
        console.log('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      {student ? (
        <div>
          <div className="bg-gray-800 p-4 flex justify-around">
            <button
              className={`text-white ${selectedSection === 'info' ? 'font-bold' : ''}`}
              onClick={() => setSelectedSection('info')}
            >
              Info
            </button>
            <button
              className={`text-white ${selectedSection === 'classes' ? 'font-bold' : ''}`}
              onClick={() => setSelectedSection('classes')}
            >
              Classes
            </button>
            <button
              className={`text-white ${selectedSection === 'payments' ? 'font-bold' : ''}`}
              onClick={() => setSelectedSection('payments')}
            >
              Payments
            </button>
          </div>

          {selectedSection === 'info' && (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">Info</h2>
              <p className="text-base mb-1">Name: {student.name}</p>
              <p className="text-base mb-1">Course: {student.course}</p>
              <p className="text-base">
                Rate: {student.rate} {student.currency === 'e' ? '€' : student.currency === 's' ? '$' : '(currency not specified)'}/h
              </p>
              <p className="text-base mb-1">
                Meet Link: <a href={student.meetLink} target="_blank" rel="noopener noreferrer">{student.meetLink}</a>
              </p>
              <p className="text-base mb-1">
                Whiteboard Link: <a href={student.whiteboardLink} target="_blank" rel="noopener noreferrer">{student.whiteboardLink}</a>
              </p>
            </div>
          )}

          {selectedSection === 'classes' && (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">Classes</h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Request a class</button>
              <h3 className="text-lg font-bold mt-4 mb-2">Upcoming classes</h3>
              <ul>
                {upcomingSessions.map(session => (
                  <li key={session.id}>Date: {session.date} - Time: {session.time} - Price: {session.price}</li>
                ))}
              </ul>
              <h3 className="text-lg font-bold mt-4 mb-2">Past classes</h3>
              <ul>
                {paidSessions.map(session => (
                  <li key={session.id}>
                    Date: {session.date} - Price: {session.price} -{' '}
                    <a href={session.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                      PDF
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedSection === 'payments' && (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">Payments</h2>
              <h3 className="text-lg font-bold mt-4 mb-2">Upcoming classes</h3>
              <ul>
                {unpaidSessions.map(session => (
                  <li key={session.id}>
                    Date: {session.date} - Price: {session.price}
                  </li>
                ))}
              </ul>
              <div className="mb-4 mt-4">
                <label htmlFor="fileInput" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer mr-2">
                  Upload File
                  <input type="file" className="hidden" onChange={handleFileChange} id="fileInput" />
                </label>
                {selectedFile && <span className="text-gray-500 mr-2">{selectedFile.name}</span>}
              </div>
              <div className="flex items-center mb-4">
                <select className="border border-black rounded-md py-2 px-3 mr-2" onChange={onSelectSession}>
                  <option value="">Select Session</option>
                  {unpaidSessions.map(session => (
                    <option key={session.id} value={session.id}>{session.date}</option>
                  ))}
                </select>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={onSubmit}>
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen bg-gray-200">
          <div className="border-4 border-gray-300 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default StudentPortal;
