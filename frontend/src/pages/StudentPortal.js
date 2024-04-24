import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom


function StudentPortal() {

  const { studentId } = useParams(); // Get the studentId from route parameters
  const [student, setStudent] = useState(null);
  const [paidSessions, setPaidSessions] = useState([]);
  const [unpaidSessions, setUnpaidSessions] = useState([]);


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
  }, []);

  useEffect(() => {
    if (student) {
      const paidFilter = student.sessions.filter(session => session.paid);
      const unpaidFilder = student.sessions.filter(session => !session.paid);
      setPaidSessions(paidFilter);
      setUnpaidSessions(unpaidFilder);
    }
  }, [student]);
  
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onSelectDate = (event) => {}
  const onSubmit = (event) => {}


  return (
    <div>
      {student ? (
        <div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Personal Information</h2>
            <p className="text-base mb-1">Name: {student.name}</p>
            <p className="text-base mb-1">Course: {student.course}</p>
            <p className="text-base">Rate: {student.rate} {student.currency === 'e' ? '€' : student.currency === 's' ? '$' : '(currency not specified)'}/h</p>
          </div>

          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Sessions Portal</h2>
            <div className="mb-4">
              <a
                href={student.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300 mr-2"
              >
                Join Meet
              </a>
              <a
                href={student.whiteboardLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300"
              >
                Digital Whiteboard Link
              </a>
            </div>
          </div>
          
          {paidSessions ? (
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">PDFs from Previous Sessions</h3>
              <ul>
                {paidSessions.map(session => (
                  <li key={session._id} className="mb-2">
                    <a
                      href={session.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {session.date}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            ) : (
            <p>No paid sessions</p>
          )
          }

          {unpaidSessions ? (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">Sessions to Pay</h2>
                <div>
                  <ul className="mb-2">
                    {unpaidSessions.map(session => (
                      <li key={session.id} className="text-base">
                        Date: {session.date} - Time: {session.time} - Final Price: {session.price}
                      </li>
                    ))}
                  </ul>
                  <div className="mb-4 mt-4">
                    <label htmlFor="fileInput" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer mr-2">
                      Upload File
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        id="fileInput"
                      />
                    </label>
                    {selectedFile && (
                      <span className="text-gray-500 mr-2">{selectedFile.name}</span>
                    )}
                  </div>
                  <div className="flex items-center mb-4">
                    <select
                      className="border border-black rounded-md py-2 px-3 mr-2"
                      onChange={onSelectDate}
                    >
                      <option value="">Select Session</option>
                      {unpaidSessions.map(session => (
                        <option key={session.id} value={session.date}>{session.date}</option>
                      ))}
                    </select>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      onClick={onSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
            </div>
          ) : (
            <p>No sessions to pay</p>
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