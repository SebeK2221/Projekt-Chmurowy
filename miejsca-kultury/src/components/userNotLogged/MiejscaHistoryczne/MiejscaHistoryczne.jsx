import React, { useState, useEffect } from "react";
import LocationFunction from "../ImageSystem/Location";
import TextFieldSection from "../ImageSystem/Comment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Comment from "../CommentSection/commentSection";
import ViewComments from "../CommentSection/viewComments";
import LikeBtn from "../LikeBtn/LikeBtn";

function MiejscaHistoryczne() {
  const [posts, setPosts] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [newTitle, setName] = useState("");
  const [newDescription, setDescription] = useState("");
  const [newCategory, setSelectedPlace] = useState();
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPost, setEditingPost] = useState({
    name: "",
    description: "",
    category: "",
    location: { lat: null, lng: null },
  });

  const [placeId, setPlace] = useState();
  const [rating, setRating] = useState();

  const [ratingPostId, setRatingPostId] = useState(null);
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [newRating, setEditedRating] = useState(null);

  const rolesString = localStorage.getItem("role");
  const userRoles = rolesString ? rolesString.split(",") : [];
  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/post/4`
      );
      const res = await response.json();
      const message = JSON.stringify(res);
      const messageToDisplay = JSON.parse(message);
      setPlace(placeId);
      console.log(message);
      if (response.ok) {
        
        setPosts(res);

      } else {
        toast.error(`${messageToDisplay.title}`);
        Object.entries(res.errors).forEach(([key, value]) => {
          toast.error(value.join(", "));
        });
      }
    } catch (error) {
      console.error("Błąd:", error.message);
    }
  };

  const deletePost = async (postId) => {
    let logobj = { postId };
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/post/delete-posts`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logobj),
        }
      );
      const responseStatus = response.status;
      if (responseStatus === 401) {
        toast.error("Nie można wykonać takiej operacji");
      }
      const res = await response.json();
      const message = JSON.stringify(res);
      const messageToDisplay = JSON.parse(message);

      if (response.ok) {
        toast.success(`${messageToDisplay.message}`);
        setPosts(posts.filter((post) => post.id !== postId));
      } else {
        toast.error(`${messageToDisplay.title}`);
        Object.entries(res.errors).forEach(([key, value]) => {
          toast.error(value.join(", "));
        });
      }
    } catch (error) {
      console.error("Błąd:", error.message);
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setEditingPost({
      name: post.title,
      description: post.description,
      category: post.category,
      location: { lat: post.LocalizationX, lng: post.LocalizationY },
    });
  };

  const handleLocationChange = (lat, lng) => {
    setLocation({ lat, lng });
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    console.log(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    console.log(event.target.value);
  };

  const handlePlaceChange = (event) => {
    setSelectedPlace(Number(event.target.value));
  };

  const handleUpdatePost = async (postId) => {
    const data = {
      postId,
      newTitle,
      newLocalizationX: location.lat,
      newLocalizationY: location.lng,
      newDescription,
      newCategory,
    };
    console.log(data);
    const token = localStorage.getItem("token");
    console.log(token);

    try {
      //let logobj = { postId, name, newLocalizationX, newLocalizationY, Description, Category }
      console.log(data);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/post/update-posts`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseStatus = response.status;
      if (responseStatus === 401) {
        toast.error("Nie można wykonać takiej operacji");
      }
      const res = await response.json();
      const message = JSON.stringify(res);
      const messageToDisplay = JSON.parse(message);

      if (response.ok) {
        toast.success(`${messageToDisplay.message}`);
        setPosts(posts.filter((post) => post.id !== postId));
      } else {
        toast.error(`${messageToDisplay.title}`);
        Object.entries(res.errors).forEach(([key, value]) => {
          toast.error(value.join(", "));
        });
      }
    } catch (error) {}
  };

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleSubmit = async (placeId) => {
    let ValidationError = false;

    if (!rating) {
      toast.warning("Należy wybrać ocenę.");
      ValidationError = true;
    }

    if (ValidationError) {
      return;
    }
    const data = {
      placeId,
      rating,
    };
    const token = localStorage.getItem("token");
    console.log(token);

    try {
      console.log(data);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/rating/add-ratting`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseStatus = response.status;
      if (responseStatus === 401) {
        toast.error("Nie można wykonać takiej operacji");
      }
      const res = await response.json();
      const message = JSON.stringify(res);
      const messageToDisplay = JSON.parse(message);
      if (response.ok) {
        setPlace(posts.filter((post) => post.id !== placeId));
        toast.success(`${messageToDisplay.message}`);
        window.location.reload();
      } else {
        Object.entries(res.errors).forEach(([key, value]) => {
          toast.error(value.join(", "));
        });
      }
    } catch (error) {}
  };

  const fetchRating = async (placeId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/rating/${placeId}`
      );
      const res = await response.json();
      const message = JSON.stringify(res);
      const messageToDisplay = JSON.parse(message);

      if (response.ok) {
        setPlace(res);
        console.log(posts);
      } else {
        toast.error(`${messageToDisplay.title}`);
        Object.entries(res.errors).forEach(([key, value]) => {
          toast.error(value.join(", "));
        });
      }
    } catch (error) {
      console.error("Błąd:", error.message);
    }
  };

  const handleEditRatingClick = (post) => {
    setEditingRatingId(post.id);
    setEditedRating(post.rating);
  };

  const handleEditedRatingChange = (event) => {
    setEditedRating(Number(event.target.value));
  };

  const EditRating = async (placeId) => {
    let ValidationError = false;

    if (!newRating) {
      toast.warning("Należy wybrać ocenę.");
      ValidationError = true;
    }

    if (ValidationError) {
      return;
    }
    const data = {
      placeId,
      newRating,
    };

    const token = localStorage.getItem("token");
    console.log(token);

    try {
      console.log(data);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/rating/update-ratting`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseStatus = response.status;
      if (responseStatus === 401) {
        toast.error("Nie można wykonać takiej operacji");
      }
      const res = await response.json();
      const message = JSON.stringify(res);
      const messageToDisplay = JSON.parse(message);
      if (response.ok) {
        setPlace(posts.filter((post) => post.id !== placeId));
        toast.success(`${messageToDisplay.message}`);
        window.location.reload();
      } else {
        Object.entries(res.errors).forEach(([key, value]) => {
          toast.error(value.join(", "));
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchPosts();
    fetchRating();
  }, []);

  const handleCommentError = (error) => {
    toast.error(`Błąd: ${error}`);
  };

  const handleViewCommentError = (error) => {
    toast.error(`Błąd: ${error}`);
  };

  const handleCommentSuccess = (message) => {
    toast.success(message);
    console.log(message);
  };

  const handleViewCommentSuccess = (message) => {
    toast.success(message);
    console.log(message);
  };
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ color: "#333" }}>Miejsca Historyczne</h2>
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "15px",
              margin: "15px 0",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              maxWidth: "600px",
              width: "100%",
            }}
          >
            {editingPostId === post.id ? (
              <div>
                <h3>Edytuj Post</h3>
                <select
                  value={editingPost.category}
                  name="category"
                  onChange={handlePlaceChange}
                  className="styled-select"
                >
                  <option value={0}>Wybierz rodzaj miejsca</option>
                  <option value={1}>Centra kulturalne</option>
                  <option value={2}>Centra naukowe</option>
                  <option value={3}>Instytucje kulturalne</option>
                  <option value={4}>Miejsca historyczne</option>
                  <option value={5}>Miejsca rekreacyjne</option>
                  <option value={6}>Miejsca religijne</option>
                </select>
                <TextFieldSection
                  onChange={handleNameChange}
                  placeholder={"Nowa nazwa miejsca"}
                />
                <TextFieldSection
                  onChange={handleDescriptionChange}
                  placeholder={"Nowy opis miejsca"}
                />
                <LocationFunction onLocationChange={handleLocationChange} />
                <button
                  type="button"
                  className="image_sent"
                  onClick={() => handleUpdatePost(post.id)}
                >
                  Zaktualizuj
                </button>
                <button type="button" onClick={() => setEditingPostId(null)}>
                  Anuluj
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ margin: "0 0 10px", color: "#555" }}>
                  Obiekt: {post.title}
                </h3>
                <p style={{ margin: "0 0 10px", color: "#777" }}>
                  Opis: {post.description}
                </p>
                {post.images && (
                  <img
                    src={post.images}
                    alt={post.title}
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                  />
                )}

                <p style={{ margin: "0 0 10px", color: "#777" }}>
                  Średnia ocena: {post.averageRating}
                </p>
                <LikeBtn sumaLike={post.likesCount} id_like={post.id} />
                {token && (
                  <>
                    <button
                      onClick={() => setRatingPostId(post.id)}
                      style={{
                        padding: "10px 15px",
                        backgroundColor: "#c56",
                        color: "#fff",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    >
                      Dodaj opinię
                    </button>
                  </>
                )}
                {token && ratingPostId === post.id && (
                  <div>
                    <select
                      value={rating}
                      onChange={handleRatingChange}
                      className="styled-select"
                      style={{ marginBottom: "10px" }}
                    >
                      <option value={0}>Wybierz ocenę</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                    <button
                      type="button"
                      className="image_sent"
                      onClick={() => handleSubmit(post.id)}
                      style={{
                        padding: "10px 15px",
                        backgroundColor: "#c56",
                        color: "#fff",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      Wyślij
                    </button>
                    <button type="button" onClick={() => setRatingPostId(null)}>
                      Anuluj
                    </button>
                    <div style={{ marginBottom: "20px" }}></div>
                  </div>
                )}
                {token && editingRatingId === post.id ? (
                  <div>
                    <h3>Edytuj opinię</h3>
                    <select
                      value={newRating}
                      onChange={handleEditedRatingChange}
                      className="styled-select"
                      style={{ marginBottom: "10px" }}
                    >
                      <option value={0}>Wybierz ocenę</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                    <button
                      type="button"
                      className="image_sent"
                      onClick={() => EditRating(post.id)}
                      style={{
                        padding: "10px 15px",
                        backgroundColor: "#c56",
                        color: "#fff",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      Zaktualizuj
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingRatingId(null)}
                    >
                      Anuluj
                    </button>
                    <div style={{ marginBottom: "20px" }}></div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditRatingClick(post)}
                    style={{
                      padding: "10px 15px",
                      backgroundColor: "#5555",
                      color: "#fff",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Edytuj opinię
                  </button>
                )}
                {userRoles.includes("Admin") && (
                  <>
                    <button
                      onClick={() => deletePost(post.id)}
                      style={{
                        padding: "10px 15px",
                        backgroundColor: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    >
                      Usuń
                    </button>
                    <button
                      onClick={() => handleEditClick(post)}
                      style={{
                        padding: "10px 15px",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Edytuj
                    </button>
                  </>
                )}
                <div style={{ marginBottom: "20px" }}></div>

                <ViewComments
                  postId={post.id}
                  onError={handleViewCommentError}
                  onSuccess={handleViewCommentSuccess}
                />
                <Comment
                  postId={post.id}
                  onError={handleCommentError}
                  onSuccess={handleCommentSuccess}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p style={{ color: "#777" }}>Brak postów do wyświetlenia.</p>
      )}
      <ToastContainer />
    </div>
  );
}
export default MiejscaHistoryczne;
