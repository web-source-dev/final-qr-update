import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditQRForm = () => {
  const { userId } = useParams();  // Get the user ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    work_email: '',
    organization: '',
    phone: '',
    address: '',
    youtube_url: '',
    facebook_url: '',
    linkden_url: '',
    twitter_url: '',
    user_image: null,  // To store the image file
  });

  const [message, setMessage] = useState('');
  const [showdata,setShowData] = useState([])
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state for form submission

  // Load the current user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://final-qr-update-b.vercel.app/api/users/${userId}`);
        console.log(response.data);  // Log the user data for debugging
        setFormData({
          ...response.data,
          user_image: null, // We don't want to overwrite the image field
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        setMessage('Error loading user data');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, user_image: file }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.put(
        `https://final-qr-update-b.vercel.app/api/qrdata/${userId}`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setMessage('User updated successfully!');
      setMessageType('success');

      // Reset form data after successful update
      setFormData({
        name: '',
        email: '',
        work_email: '',
        organization: '',
        phone: '',
        address: '',
        youtube_url: '',
        facebook_url: '',
        linkden_url: '',
        twitter_url: '',
        user_image: null,
      });

      // Optionally redirect to user details page after successful update
      navigate(`/data`);
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error: Could not update user data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-form-c">
      <div className="qr-form-container">
        <button onClick={() => navigate('/data')}>All users</button>
        <h1>Edit User</h1>

        <form className="qr-form" onSubmit={handleFormSubmit}>
          <div className="form-inputs-flex">
            <div className="left-side-form">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="work_email"
                placeholder="Work Email"
                value={formData.work_email}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="right-side-form">
              <input
                type="text"
                name="organization"
                placeholder="Organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
              />
              <input
                type="url"
                name="youtube_url"
                placeholder="YouTube URL"
                value={formData.youtube_url}
                onChange={handleInputChange}
              />
              <input
                type="url"
                name="facebook_url"
                placeholder="Facebook URL"
                value={formData.facebook_url}
                onChange={handleInputChange}
              />
              <input
                type="url"
                name="linkden_url"
                placeholder="LinkedIn URL"
                value={formData.linkden_url}
                onChange={handleInputChange}
              />
              <input
                type="url"
                name="twitter_url"
                placeholder="Twitter URL"
                value={formData.twitter_url}
                onChange={handleInputChange}
              />
              <input
                type="file"
                name="user_image"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>

          {message && (
            <p className={messageType === 'success' ? 'success-message' : 'error-message'}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditQRForm;
