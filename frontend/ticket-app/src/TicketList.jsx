import { useEffect, useState } from "react";
import api from "./api";

export default function TicketList(){

  const [tickets,setTickets] = useState([]);

  const load = async () => {
    const r = await api.get("tickets/");
    setTickets(r.data);
  };

  useEffect(()=>{ load(); },[]);

  const badge = (p) => ({
    low:"bg-green-100 text-green-700",
    medium:"bg-yellow-100 text-yellow-700",
    high:"bg-orange-100 text-orange-700",
    critical:"bg-red-100 text-red-700"
  }[p]);

  return (
    <div className="space-y-4">

      {tickets.map(t=>(
        <div key={t.id}
          className="bg-white shadow rounded-xl p-4">

          <div className="flex justify-between">
            <h3 className="font-semibold">{t.title}</h3>
            <span className={`px-2 py-1 text-xs rounded ${badge(t.priority)}`}>
              {t.priority}
            </span>
          </div>

          <p className="text-gray-600 mt-2">
            {t.description.slice(0,120)}...
          </p>

          <div className="mt-3 flex gap-3 text-sm text-gray-500">
            <span>{t.category}</span>
            <span>{t.status}</span>
            <span>{new Date(t.created_at).toLocaleString()}</span>
          </div>

        </div>
      ))}

    </div>
  );
}
