export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Support Ticket System
        </h1>

        <TicketForm />
        <Stats />
        <TicketList />
      </div>

    </div>
  );
}
