// 📁 FRONTEND FILE: src/components/TemporaryGroupChat/CreateTempGroupModal.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateTempGroupModal = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [expiry, setExpiry] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("/api/v1/users");
      setUsers(data.users);
    };
    fetchUsers();
  }, []);

  const handleCreateGroup = async () => {
    await axios.post("/api/v1/groups/temporary", {
      members: selectedUsers,
      expiresAt: expiry,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create Temporary Group</h2>
        <label className="block mb-2">Select Users:</label>
        <div className="h-32 overflow-y-auto border rounded mb-4 p-2">
          {users.map((u) => (
            <div key={u._id}>
              <input
                type="checkbox"
                value={u._id}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedUsers((prev) =>
                    e.target.checked
                      ? [...prev, val]
                      : prev.filter((id) => id !== val)
                  );
                }}
              />{" "}
              {u.username}
            </div>
          ))}
        </div>
        <label className="block mb-2">Expiry Time:</label>
        <input
          type="datetime-local"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setExpiry(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleCreateGroup}
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default CreateTempGroupModal;
