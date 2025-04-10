// 📁 FRONTEND FILE: src/components/TemporaryGroupChat/CreateGroupIcon.jsx

import React, { useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import CreateTempGroupModal from "./CreateTempGroupModal";

const CreateGroupIcon = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="p-2 text-blue-600 hover:text-blue-800"
        onClick={() => setOpen(true)}
        title="Create Temporary Group"
      >
        <MdGroupAdd size={24} />
      </button>
      <CreateTempGroupModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default CreateGroupIcon;
