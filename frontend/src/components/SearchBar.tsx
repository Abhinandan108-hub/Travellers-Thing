import { MapPin, CalendarDays, Users, Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative z-20 -mt-[55px]">
      <div className="container-wide">
        <div className="bg-background rounded-lg shadow-xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Location
            </label>
            <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2.5">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <input
                type="text"
                placeholder="Where to?"
                className="bg-transparent text-sm w-full outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Check-in */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Check In
            </label>
            <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2.5">
              <CalendarDays className="h-4 w-4 text-primary shrink-0" />
              <input
                type="date"
                className="bg-transparent text-sm w-full outline-none text-muted-foreground"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Check Out
            </label>
            <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2.5">
              <CalendarDays className="h-4 w-4 text-primary shrink-0" />
              <input
                type="date"
                className="bg-transparent text-sm w-full outline-none text-muted-foreground"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Guests
            </label>
            <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2.5">
              <Users className="h-4 w-4 text-primary shrink-0" />
              <select className="bg-transparent text-sm w-full outline-none text-muted-foreground">
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4+ Guests</option>
              </select>
            </div>
          </div>

          {/* Search button */}
          <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm rounded-pill py-3 hover:-translate-y-[2px] transition-all duration-300 shadow-md hover:shadow-lg">
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
