import { useState } from "react";
import api from "./api";

export default function TicketForm() {

  const [f,setF] = useState({
    title:"", description:"",
    category:"general", priority:"low"
  });

  const [loading,setLoading] = useState(false);

  const classify = async () => {
    if (!f.description) return;
    setLoading(true);
    const r = await api.post("tickets/classify/", {
      description: f.description
    });
    setF({...f,
      category:r.data.suggested_category,
      priority:r.data.suggested_priority
    });
    setLoading(false);
  };

  const submit = async () => {
    await api.post("tickets/", {...f, status:"open"});
    setF({title:"",description:"",category:"general",priority:"low"});
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6">

      <h2 className="text-xl font-semibold mb-4">Submit Ticket</h2>

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Title"
        value={f.title}
        onChange={e=>setF({...f,title:e.target.value})}
      />

      <textarea
        className="w-full border p-2 rounded mb-3"
        rows="4"
        placeholder="Description"
        value={f.description}
        onChange={e=>setF({...f,description:e.target.value})}
        onBlur={classify}
      />

      {loading && (
        <p className="text-sm text-gray-500 mb-2">
          Getting AI suggestion...
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">

        <select
          className="border p-2 rounded"
          value={f.category}
          onChange={e=>setF({...f,category:e.target.value})}>
          <option>billing</option>
          <option>technical</option>
          <option>account</option>
          <option>general</option>
        </select>

        <select
          className="border p-2 rounded"
          value={f.priority}
          onChange={e=>setF({...f,priority:e.target.value})}>
          <option>low</option>
          <option>medium</option>
          <option>high</option>
          <option>critical</option>
        </select>

      </div>

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit Ticket
      </button>
    </div>
  );
}
