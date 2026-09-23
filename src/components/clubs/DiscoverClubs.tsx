import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MapPin, 
  SlidersHorizontal, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  X
} from 'lucide-react';
import { RunClub, RunningLevel, DistancePreference, User } from '../../types';
import { db } from '../../services/db';

interface DiscoverClubsProps {
  currentUser: User;
  onSelectClub: (clubId: string) => void;
  onClubJoined: (clubId: string) => void;
}

export const DiscoverClubs: React.FC<DiscoverClubsProps> = ({
  currentUser,
  onSelectClub,
  onClubJoined,
}) => {
  const [clubs, setClubs] = useState<RunClub[]>(db.getClubs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New club form state
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('Cannaught Place');
  const [runningLevel, setRunningLevel] = useState<RunningLevel>('mixed');
  const [typicalDistance, setTypicalDistance] = useState<DistancePreference>('5-10k');
  const [typicalTime, setTypicalTime] = useState('06:00 AM');
  const [rulesInput, setRulesInput] = useState('Respect every pace\nLeave no runner behind');

  const city = db.getCityData();
  const neighborhoods = ['All', ...city.neighborhoods];

  const filteredClubs = clubs.filter((c) => {
    if (c.isSuspended) return false;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesNeighborhood =
      selectedNeighborhood === 'All' || c.neighborhood === selectedNeighborhood;

    const matchesLevel =
      selectedLevel === 'All' || c.runningLevel === selectedLevel;

    return matchesSearch && matchesNeighborhood && matchesLevel;
  });

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const rules = rulesInput.split('\n').map((r) => r.trim()).filter(Boolean);

    const newClub = db.createClub({
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      tagline: tagline.trim() || 'Running strong in Sambhajinagar',
      description: description.trim() || 'A passionate local run crew.',
      cityId: currentUser.cityId,
      cityName: currentUser.cityName,
      neighborhood,
      runningLevel,
      typicalDistance,
      typicalTime,
      privacy: 'public',
      rules,
      ownerId: currentUser.id,
      adminIds: [currentUser.id],
      memberIds: [currentUser.id],
    });

    setClubs(db.getClubs());
    setShowCreateModal(false);
    onClubJoined(newClub.id);
  };

  const handleQuickJoin = (e: React.MouseEvent, clubId: string) => {
    e.stopPropagation();
    db.joinClub(currentUser.id, clubId);
    setClubs(db.getClubs());
    onClubJoined(clubId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-24 md:pb-12 space-y-6">
      
      {/* Header & Create Club Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#59ab02]">
            Community & Collectives
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
            RUN CLUBS
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Discover active running crews in Chhatrapati Sambhajinagar.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="h-11 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#72D600]" />
          <span>CREATE RUN CLUB</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Run Clubs by name, neighborhood, or vibe..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#72D600]"
          />
        </div>

        {/* Neighborhood Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Area:
          </span>
          {neighborhoods.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedNeighborhood(area)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition-colors ${
                selectedNeighborhood === area
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClubs.map((club) => {
          const isMember = currentUser.joinedClubIds.includes(club.id);

          return (
            <div
              key={club.id}
              onClick={() => onSelectClub(club.id)}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Neighborhood & Rank */}
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    <MapPin className="w-3 h-3 text-[#65C800]" />
                    <span>{club.neighborhood}</span>
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-900">
                    Rank #{club.clubRank}
                  </span>
                </div>

                <h3 className="font-display font-black text-lg text-slate-900 group-hover:text-[#529d00] transition-colors">
                  {club.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                  "{club.tagline}"
                </p>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {club.description}
                </p>

                {/* Key specs */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Runners</span>
                    <strong className="font-mono font-bold text-slate-900">{club.activeMembersCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Distance</span>
                    <strong className="font-mono font-bold text-slate-900">{club.typicalDistance}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">This Month</span>
                    <strong className="font-mono font-bold text-[#529d00]">{club.monthlyDistanceKm.toFixed(0)}k</strong>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{club.typicalTime}</span>
                </span>

                {isMember ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Member</span>
                  </span>
                ) : (
                  <button
                    onClick={(e) => handleQuickJoin(e, club.id)}
                    className="py-1.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>JOIN</span>
                    <ArrowRight className="w-3 h-3 text-[#72D600]" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-display font-bold text-slate-900 text-base">No Run Clubs Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or filter, or be the pioneer to create a new Run Club in this area!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Create New Run Club
          </button>
        </div>
      )}

      {/* CREATE RUN CLUB MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900">
                  Create a Run Club
                </h3>
                <p className="text-xs text-slate-500">
                  Gather local runners in Chhatrapati Sambhajinagar
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Club Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shendra Sunrise Striders"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#72D600] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Tagline *</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Dawn speedwork along the industrial corridor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#72D600]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell runners when, where, and what pace your club runs..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#72D600]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Neighborhood</label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#72D600] font-medium"
                  >
                    {city.neighborhoods.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Typical Meeting Time</label>
                  <input
                    type="text"
                    value={typicalTime}
                    onChange={(e) => setTypicalTime(e.target.value)}
                    placeholder="06:00 AM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#72D600] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Running Level</label>
                  <select
                    value={runningLevel}
                    onChange={(e) => setRunningLevel(e.target.value as RunningLevel)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#72D600] font-medium"
                  >
                    <option value="mixed">Mixed (All Welcome)</option>
                    <option value="beginner">Beginner Friendly</option>
                    <option value="intermediate">Intermediate (5-10K)</option>
                    <option value="advanced">Advanced (Sub 5:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Typical Distance</label>
                  <select
                    value={typicalDistance}
                    onChange={(e) => setTypicalDistance(e.target.value as DistancePreference)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#72D600] font-medium"
                  >
                    <option value="3-5k">3 - 5 KM</option>
                    <option value="5-10k">5 - 10 KM</option>
                    <option value="10-15k">10 - 15 KM</option>
                    <option value="15k+">15+ KM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Club Rules (one per line)</label>
                <textarea
                  rows={2}
                  value={rulesInput}
                  onChange={(e) => setRulesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#72D600]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  Create & Launch Club
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-3 px-4 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
