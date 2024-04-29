async function fetchDiaryData() {
    try {
      const session = window.sessionStorage.getItem('session_id'); // Use session storage
      if (!session) {
        throw new Error('No session ID found');
      }
  
      const response = await axios.get('http://localhost:3000/api/diary?fields=[\"uid\",\"entity_uid\",\"treating_doctor_uid\",\"service_center_uid\",\"booking_type_uid\",\"name\",\"uuid\",\"disabled\"]', {
        withCredentials: true, // Include session cookie
      });
  
      if (response.status === 200) {
        const diaryData = response.data;
        // Process the response data here
      } else {
        console.error('Error fetching diary data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching diary data:', error);
    }
  }