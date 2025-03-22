import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ToastContainer } from "react-toastify";

export default function LikeBtn({ sumaLike, id_like }) {
  const [likes, setLikes] = useState(sumaLike);
  const [clicked, setClicked] = useState(false);
  const likeLogoRef = useRef(null);
  const cardRef = useRef(null);
  const token = localStorage.getItem("token");

  const addLikeToPost = async (postId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/post/like-post`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId: postId }),
        }
      );

      if (response.ok) {
        const res = await response.json();
        setLikes(res.newLikesCount);
        setClicked(!clicked);
      }
    } catch (error) {
      console.error("Błąd:", error.message);
    }
    window.location.reload();
  };

  useEffect(() => {
    if (clicked) {
      gsap.fromTo(
        likeLogoRef.current,
        { scale: 0.85, opacity: 0.7 },
        {
          scale: 1.2,
          opacity: 1,
          duration: 0.7,
          ease: "elastic.out(1, 0.75)",
          yoyo: true,
          repeat: 1,
          rotation: 0,
          stagger: 0.2,
          delay: 0.1,
        }
      );
      gsap.to(cardRef.current, {
        boxShadow: "0px 0px 15px 2px rgba(255, 131, 131, 0.38)",
      });
    } else {
      gsap.to(likeLogoRef.current, { scale: 1, opacity: 1, duration: 0.7 });
      gsap.to(cardRef.current, {
        boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.2)",
      });
    }
  }, [clicked]);

  const handleClick = () => {
    addLikeToPost(id_like);
  };

  return (
    <div
      style={{
        display: "inline-block",
        padding: "10px",
        border: "1px solid transparent",
        borderRadius: "8px",
      }}
    >
      <img
        ref={likeLogoRef}
        className="likeLogo"
        src={
          process.env.PUBLIC_URL +
          (clicked ? "/Heart_Logo_Liked.svg" : "/Heart_Logo_Liked.svg")
        }
        alt={clicked ? "liked" : "like"}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      />
      <p className="likeCounter">Polubienia: {likes}</p>
      <div ref={cardRef} className="card"></div>
      <ToastContainer />
    </div>
  );
}
