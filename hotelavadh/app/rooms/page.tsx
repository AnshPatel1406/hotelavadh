import Link from "next/link";

type Room = {
  _id: string;
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  type: string;
  roomNumber: number;
};

export default async function RoomsPage() {
  const res = await fetch("http://localhost:3000/api/rooms", {
    cache: "no-store",
  });

  const data = await res.json();

  const rooms: Room[] = data.rooms || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-800">
            Explore Our Rooms
          </h1>

          <p className="text-gray-600 mt-2">
            Comfortable and luxurious rooms for your perfect stay.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Link
              key={room._id}
              href={`/rooms/${room._id}`}
              className="group"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-200 hover:-translate-y-2">
                
                {/* Top Colored Banner */}
                <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <h2 className="text-white text-2xl font-bold tracking-wide">
                    {room.title}
                  </h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Room Info */}
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {room.type}
                    </span>

                    <span className="text-sm text-gray-500">
                      Room #{room.roomNumber}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {room.description}
                  </p>

                  {/* Guests */}
                  <div className="mt-5 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                      👥
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Max Guests</p>
                      <p className="font-semibold text-slate-800">
                        {room.maxGuests} Guests
                      </p>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">
                        Price Per Night
                      </p>

                      <p className="text-3xl font-bold text-slate-900">
                        ₹{room.pricePerNight}
                      </p>
                    </div>

                    <button className="bg-slate-900 text-white px-5 py-2 rounded-xl font-medium hover:bg-slate-700 transition">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {rooms.length === 0 && (
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-semibold text-slate-700">
              No Rooms Available
            </h2>

            <p className="text-gray-500 mt-2">
              Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}