import { useEffect, useState } from "react";
import api from "./api";

export default function Stats(){

  const [s,setS] = useState(null);

  const load = async () => {
    const r = await api.get("tickets/stats/");
    setS(r.data);
  };

  useEffect(()=>{ load(); },[]);

  if(!s) return null;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">

      <Card title="Total" value={s.total_tickets}/>
      <Card title="Open" value={s.open_tickets}/>
      <Card title="Avg / Day" value={s.avg_tickets_per_day}/>

    </div>
  );
}

function Card({title,value}){
  return (
    <div className="bg-white shadow rounded-xl p-4 text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
