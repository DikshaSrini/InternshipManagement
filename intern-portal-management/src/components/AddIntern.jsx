import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const durationOptions = [
    "1 month",
    "2 months",
    "3 months",
    "4 months",
    "5 months",
    "6 months",
];

const AddIntern = ({ setInterns }) => {
    const [newIntern, setNewIntern] = useState({
        name: "",
        position: "",
        institution: "",
        skills: [],
        socialLinks: [{ platform: "", url: "" }],
        duration: "3 months",
        description: "",
        status: "Available",
        funFact: "",
        image: "",  // Initially empty
        isAvailable: true,
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewIntern((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSkillChange = (e) => {
        setNewIntern({
            ...newIntern,
            skills: e.target.value.split(",").map((s) => s.trim()),
        });
    };

    const handleSocialLinkChange = (e, index) => {
        const { name, value } = e.target;
        const links = [...newIntern.socialLinks];
        links[index][name] = value;
        setNewIntern({ ...newIntern, socialLinks: links });
    };

    const addSocialLink = () => {
        setNewIntern({
            ...newIntern,
            socialLinks: [...newIntern.socialLinks, { platform: "", url: "" }],
        });
    };

    const removeSocialLink = (index) => {
        const filtered = newIntern.socialLinks.filter((_, i) => i !== index);
        setNewIntern({ ...newIntern, socialLinks: filtered });
    };

    const validateForm = () => {
        const errs = {};
        if (!newIntern.name) errs.name = "Name is required.";
        if (!newIntern.position) errs.position = "Position is required.";
        if (!newIntern.institution) errs.institution = "Institution is required.";
        if (newIntern.skills.length === 0) errs.skills = "Add at least one skill.";
        if (!newIntern.description) errs.description = "Description is required.";
        if (!newIntern.status) errs.status = "Status is required.";
        if (!newIntern.funFact) errs.funFact = "Fun fact required.";
        if (!newIntern.image) errs.image = "Image is required.";
        
        // Validate social links
        newIntern.socialLinks.forEach((link, index) => {
            if (link.url && !/^https?:\/\/[^\s]+$/.test(link.url)) {
                errs[`socialLinks[${index}]`] = "Please enter a valid URL.";
            }
        });

        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
    
        // Create the payload object
        const formData = {
            name: newIntern.name,
            position: newIntern.position,
            institution: newIntern.institution,
            skills: newIntern.skills,
            socialLinks: newIntern.socialLinks,
            duration: newIntern.duration,
            description: newIntern.description,
            status: newIntern.status,
            funFact: newIntern.funFact,
            isAvailable: newIntern.isAvailable,
            image: newIntern.image,
        };
    
        // Use the backend API endpoint instead of direct modification
        fetch("http://localhost:5000/api/interns", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setInterns((prev) => [...prev, data]);
                alert("Intern profile added successfully!");
                setNewIntern({
                    name: "",
                    position: "",
                    institution: "",
                    skills: [],
                    socialLinks: [{ platform: "", url: "" }],
                    duration: "3 months",
                    description: "",
                    status: "Available",
                    funFact: "",
                    image: "",
                    isAvailable: true,
                });
                navigate("/");
            })
            .catch((err) => {
                console.error("Error posting intern:", err);
                alert("There was an error posting the intern.");
            });
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please upload a valid image file.");
                return;
            }

            const reader = new FileReader();

            reader.onloadend = () => {
                setNewIntern({
                    ...newIntern,
                    image: reader.result,
                });
            };

            reader.readAsDataURL(file);
        }
    };

    const inputStyle = {
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    };

    const labelStyle = {
        marginBottom: "0.25rem",
        fontWeight: "bold",
    };

    const fullWidth = {
        width: "100%",
        padding: "0.5rem",
        fontSize: "1rem",
    };

    const errorStyle = {
        color: "red",
        fontSize: "0.875rem",
        marginTop: "0.25rem",
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                maxWidth: "600px",
                margin: "2rem auto",
                padding: "2rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
        >
            <h2 style={{ textAlign: "center" }}>Add Intern</h2>

            {/* Name */}
            <div style={inputStyle}>
                <label style={labelStyle}>Name</label>
                <input
                    type="text"
                    name="name"
                    style={fullWidth}
                    value={newIntern.name}
                    onChange={handleChange}
                />
                {errors.name && <small style={errorStyle}>{errors.name}</small>}
            </div>

            {/* Position */}
            <div style={inputStyle}>
                <label style={labelStyle}>Position</label>
                <input
                    type="text"
                    name="position"
                    style={fullWidth}
                    value={newIntern.position}
                    onChange={handleChange}
                />
                {errors.position && <small style={errorStyle}>{errors.position}</small>}
            </div>

            {/* Institution */}
            <div style={inputStyle}>
                <label style={labelStyle}>Institution</label>
                <input
                    type="text"
                    name="institution"
                    style={fullWidth}
                    value={newIntern.institution}
                    onChange={handleChange}
                />
                {errors.institution && <small style={errorStyle}>{errors.institution}</small>}
            </div>

            {/* Skills */}
            <div style={inputStyle}>
                <label style={labelStyle}>Skills (comma separated)</label>
                <input
                    type="text"
                    value={newIntern.skills.join(", ")}
                    style={fullWidth}
                    onChange={handleSkillChange}
                />
                {errors.skills && <small style={errorStyle}>{errors.skills}</small>}
            </div>

            {/* Social Links */}
            <div style={inputStyle}>
                <label style={labelStyle}>Social Links</label>
                {newIntern.socialLinks.map((link, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: "flex",
                            gap: "1rem",
                            marginBottom: "0.5rem",
                            width: "100%",
                        }}
                    >
                        <input
                            type="text"
                            name="platform"
                            placeholder="Platform"
                            value={link.platform}
                            onChange={(e) => handleSocialLinkChange(e, idx)}
                            style={{ flex: 1 }}
                        />
                        <input
                            type="url"
                            name="url"
                            placeholder="URL"
                            value={link.url}
                            onChange={(e) => handleSocialLinkChange(e, idx)}
                            style={{ flex: 2 }}
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeSocialLink(idx);
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addSocialLink}>
                    Add Link
                </button>
            </div>

            {/* Duration Slider */}
            <div style={inputStyle}>
                <label style={labelStyle}>
                    Internship Duration: {newIntern.duration}
                </label>
                <input
                    type="range"
                    min="0"
                    max={durationOptions.length - 1}
                    value={durationOptions.indexOf(newIntern.duration)}
                    onChange={(e) =>
                        setNewIntern({
                            ...newIntern,
                            duration: durationOptions[e.target.value],
                        })
                    }
                    style={{ width: "100%" }}
                />
            </div>

            {/* Description */}
            <div style={inputStyle}>
                <label style={labelStyle}>Description</label>
                <textarea
                    name="description"
                    rows={3}
                    style={fullWidth}
                    value={newIntern.description}
                    onChange={handleChange}
                />
                {errors.description && <small style={errorStyle}>{errors.description}</small>}
            </div>

            {/* Status */}
            <div style={inputStyle}>
                <label style={labelStyle}>Status</label>
                <select
                    name="status"
                    style={fullWidth}
                    value={newIntern.status}
                    onChange={handleChange}
                >
                    <option value="Available">Available</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Waiting for Full-Time">Waiting for Full-Time</option>
                </select>
                {errors.status && <small style={errorStyle}>{errors.status}</small>}
            </div>

            {/* Checkbox */}
            <div style={inputStyle}>
                <label style={labelStyle}>
                    <input
                        type="checkbox"
                        name="isAvailable"
                        checked={newIntern.isAvailable}
                        onChange={handleChange}
                    />{" "}
                    Currently Available?
                </label>
            </div>

            {/* Fun Fact */}
            <div style={inputStyle}>
                <label style={labelStyle}>Fun Fact</label>
                <input
                    type="text"
                    name="funFact"
                    style={fullWidth}
                    value={newIntern.funFact}
                    onChange={handleChange}
                />
                {errors.funFact && <small style={errorStyle}>{errors.funFact}</small>}
            </div>

            {/* Image Upload */}
            <div style={inputStyle}>
                <label style={labelStyle}>Upload Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ width: "100%" }}
                />
                {errors.image && <small style={errorStyle}>{errors.image}</small>}
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <button type="submit" style={{ marginTop: "1rem", padding: "1rem", fontSize: "1rem" }}>
                    Add Intern
                </button>
            </div>
        </form>
    );
};

export default AddIntern;