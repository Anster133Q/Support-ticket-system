import TicketForm from './TicketForm';
import StatsCards from './Stats';
import TicketList from './TicketList';

export default function App() {
  return (
    <div className="min-h-screen bg-space text-gray-100">
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_15%_25%,rgba(168,85,247,0.08),transparent_55%)]" />
          <div className="w-full h-full bg-[radial-gradient(circle_at_85%_75%,rgba(124,58,237,0.07),transparent_60%)]" />
        </div>

        <header className="mb-12 text-center sm:text-left">
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            NeoDesk
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Modern support • AI assisted • Always online
          </p>
        </header>

        <div className="space-y-14">
          <TicketForm />
          <StatsCards />
          <TicketList />
        </div>
      </div>
    </div>
  );
}