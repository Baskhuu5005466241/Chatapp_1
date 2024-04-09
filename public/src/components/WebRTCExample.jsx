// import React, { useState, useEffect, useRef } from 'react';
// import styled from 'styled-components';
// import { sendMessageRoute, recieveMessageRoute } from '../utils/APIRoutes';

// const WebRTCExample = ({ socket }) => {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const peerConnection = useRef();

//   useEffect(() => {
//     const initializeWebRTC = async () => {
//       // Create peer connection
//       peerConnection.current = new RTCPeerConnection();

//       // Set up event handlers for peer connection
//       peerConnection.current.ontrack = (event) => {
//         // Add remote stream to state
//         setRemoteStream(event.streams[0]);
//       };
//     };

//     initializeWebRTC();

//     // Cleanup function
//     return () => {
//       if (peerConnection.current) {
//         peerConnection.current.close();
//       }
//     };
//   }, []);

//   const startCall = async () => {
//     try {
//       // Get user media (camera and microphone)
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       setLocalStream(stream);

//       // Add local stream to peer connection
//       stream.getTracks().forEach(track => {
//         if (!peerConnection.current.getSenders().find(s => s.track.kind === track.kind)) {
//           const sender = peerConnection.current.addTrack(track, stream);
//           if (sender) {
//             console.log('Added track to peer connection:', sender);
//           } else {
//             console.warn('error');
//           }
//         }
//       });

//       // Create offer
//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(offer);

//       // Send offer to remote peer via signaling server
//       if (socket.current) {
//         socket.current.emit('offer', offer); // Emit offer to signaling server
//       } else {
//         console.error('Socket connection not available.');
//       }
//     } catch (error) {
//       console.error('Error starting call:', error.message);
//     }
//   };

//   return (
//     <div>
//       <button style={{ transform: 'scale(1.9)' }} onClick={startCall}>Start Call</button>
//     </div>
//   );
// };

// export default WebRTCExample;






import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { sendMessageRoute, recieveMessageRoute } from '../utils/APIRoutes';

const WebRTCExample = ({ socket }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteAudioTrack, setRemoteAudioTrack] = useState(null);
  const peerConnection = useRef();

  useEffect(() => {
    const initializeWebRTC = async () => {
      // Create peer connection
      peerConnection.current = new RTCPeerConnection();

      // Set up event handlers for peer connection
      peerConnection.current.ontrack = (event) => {
        // Check if the track is audio or video
        if (event.track.kind === 'audio') {
          setRemoteAudioTrack(event.track);
        } else if (event.track.kind === 'video') {
          // Add remote stream to state
          setRemoteStream(event.streams[0]);
        }
      };
    };

    initializeWebRTC();

    // Cleanup function
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const startCall = async () => {
    try {
      // Get user media (camera and microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        if (!peerConnection.current.getSenders().find(s => s.track.kind === track.kind)) {
          const sender = peerConnection.current.addTrack(track, stream);
          if (sender) {
            console.log('Added track to peer connection:', sender);
          } else {
            console.warn('error');
          }
        }
      });

      // Create offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      // Send offer to remote peer via signaling server
      if (socket.current) {
        socket.current.emit('offer', offer); // Emit offer to signaling server
      } else {
        console.error('Socket connection not available.');
      }
    } catch (error) {
      console.error('Error starting call:', error.message);
    }
  };

  const stopCall = () => {
    // Stop local media stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setRemoteStream(null);
    setRemoteAudioTrack(null);
  };

  return (
    <div>
      <button style={{ transform: 'scale(1.9)' }} onClick={startCall}>Start Call</button>
      <button style={{ transform: 'scale(1.9)' }} onClick={stopCall}>Stop Call</button>
      {/* Display remote video stream */}
      {remoteStream && (
        <video style={{ width: '100%', height: 'auto', margin: '10px 0' }} autoPlay ref={(ref) => {
          if (ref) {
            ref.srcObject = remoteStream;
          }
        }}></video>
      )}
      {/* Display remote audio stream */}
    </div>
  );
};

export default WebRTCExample;
