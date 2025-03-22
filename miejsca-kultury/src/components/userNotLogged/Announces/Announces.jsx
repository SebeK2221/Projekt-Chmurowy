import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AnnounceCart from "./AnnounceCart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Annouces = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("today");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role && role.split(',').includes("Admin")) {
      setIsAdmin(true);
    }
  }, []);

  const filterToState = {
    past: 1,
    today: 2,
    future: 3,
  };


  const fetchEvents = async (state) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/announcement/${state}`
      );
      const data = await response.json();
      console.log(data); 
      setEvents(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const deleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/announcement`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ announcementId: id }),
      });

      if (response.ok) {
        toast.success("Event deleted successfully");
        await fetchEvents(filterToState[filter]);
      } else {
        const errorData = await response.json();
        toast.error("Error deleting event: " + (errorData.message || response.statusText));
        console.error("Error deleting event:", response.statusText);
      }
    } catch (error) {
      toast.error("Error deleting event: " + error.message);
      console.error("Error deleting event:", error);
    }
  };

  useEffect(() => {
    fetchEvents(filterToState[filter]);
  }, [filter]);

  useEffect(() => {
    fetchEvents(2);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center my-4">
        <button
          className={`btn mx-2 ${filter === "past" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => handleFilterChange("past")}
        >
          Stare wydarzenia
        </button>
        <button
          className={`btn mx-2 ${filter === "today" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => handleFilterChange("today")}
        >
          Dzisiejsze wydarzenia
        </button>
        <button
          className={`btn mx-2 ${filter === "future" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => handleFilterChange("future")}
        >
          Planowane wydarzenia
        </button>
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {events.map((event) => (
            <AnnounceCart
              key={event.id}
              id={event.id}
              localization={event.localization}
              date={event.date}
              dataDescription={event.dataDescription}
              description={event.description}
              isAdmin={isAdmin}
              onDelete={deleteEvent}
            />
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Annouces;
