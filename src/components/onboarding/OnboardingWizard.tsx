import React, { useState } from 'react';
import { 
  Check, 
  MapPin, 
  Users, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Compass,
  Trophy,
  CheckCircle2,
  X
} from 'lucide-react';
import { User, RunClub } from '../../types';
import { db } from '../../services/db';
import { authService } from '../../services/auth';
import { 
  SUPPORTED_STATES, 
  SUPPORTED_CITIES, 
  getCitiesByState, 
  GeoState, 
  GeoCity 
} from '../../services/geoData';
import { RunFamLogo } from '../common/RunFamLogo';

interface OnboardingWizardProps {
  currentUser: User;
  onComplete: (updatedUser: User) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  currentUser,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 2 State
  const [selectedStateId, setSelectedStateId] = useState<string>(currentUser.state_id || 'state_mh');
  const [selectedCityId, setSelectedCityId] = useState<string>(currentUser.cityId || 'city_csn');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(
    currentUser.neighborhood || 'Waluj'
  );

  // Step 3 State
  const [selectedClubId, setSelectedClubId] = useState<string | null>(currentUser.primaryClubId || null);
  const [showCreateClubModal, setShowCreateClubModal] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubNeighborhood, setNewClubNeighborhood] = useState('');
  const [newClubDescription, setNewClubDescription] = useState('');

  // Cities list derived from selected state
  const availableCities = getCitiesByState(selectedStateId);
  const currentCityObj = SUPPORTED_CITIES.find((c) => c.id === selectedCityId) || availableCities[0];

  // Clubs in current city from db
  const availableClubs = db.getClubs().filter((c) => !c.isSuspended);

  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    const citiesInState = getCitiesByState(stateId);
    if (citiesInState.length > 0) {
      setSelectedCityId(citiesInState[0].id);
      setSelectedNeighborhood(citiesInState[0].neighborhoods[0] || 'Central');
    }
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = SUPPORTED_CITIES.find((c) => c.id === cityId);
    if (city && city.neighborhoods.length > 0) {
      setSelectedNeighborhood(city.neighborhoods[0]);
    }
  };

  const handleCreateClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubName.trim()) return;

    const created = db.createClub({
      name: newClubName.trim(),
      slug: newClubName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      tagline: 'Community running crew on RunFam.',
      description: newClubDescription.trim() || 'Community running crew on RunFam.',
      cityId: selectedCityId,
      cityName: currentCityObj?.name || 'Chhatrapati Sambhajinagar',
      state: currentCityObj?.stateName || 'Maharashtra',
      country: 'India',
      neighborhood: newClubNeighborhood.trim() || selectedNeighborhood,
      runningLevel: 'mixed',
      typicalDistance: '5-10k',
      typicalTime: '06:00 AM',
      privacy: 'public',
      logoUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=150&auto=format&fit=crop&q=80',
      ownerId: currentUser.id,
      adminIds: [currentUser.id],
      memberIds: [currentUser.id],
      schedule: 'Tue & Thu 6:00 AM, Sun 6:30 AM',
      meetingPoint: newClubNeighborhood.trim() || 'City Sports Complex',
    });

    setSelectedClubId(created.id);
    setShowCreateClubModal(false);
  };

  const handleFinishOnboarding = () => {
    const updated = authService.completeOnboarding(currentUser.id, {
      stateId: selectedStateId,
      stateName: SUPPORTED_STATES.find((s) => s.id === selectedStateId)?.name || 'Maharashtra',
      cityId: selectedCityId,
      cityName: currentCityObj?.name || 'Chhatrapati Sambhajinagar',
      primaryClubId: selectedClubId || undefined,
      neighborhood: selectedNeighborhood,
    });
    onComplete(updated);
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/80 transition-all relative overflow-hidden">
        
        {/* Progress Tracker (4 Steps) */}
        <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RunFamLogo variant="compact" size="sm" />
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider ml-1">
              • Onboarding
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`h-2 rounded-full transition-all duration-300 ${
                  stepNumber === step
                    ? 'w-7 bg-[#72D600]'
                    : stepNumber < step
                    ? 'w-2.5 bg-slate-800'
                    : 'w-2.5 bg-slate-200'
                }`}
              />
            ))}
            <span className="text-xs font-mono font-bold text-slate-600 ml-2">
              {step} / 4
            </span>
          </div>
        </div>

        {/* STEP 1: WELCOME TO RUNFAM */}
        {step === 1 && (
          <div className="pt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-50 text-[#529d00] font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 1 of 4</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900">
                LET'S GET YOU SET UP 🏃
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Welcome to the city-based running platform where every kilometer counts.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                <div className="w-8 h-8 rounded-xl bg-lime-100 text-[#529d00] flex items-center justify-center font-bold text-sm mb-2">
                  1
                </div>
                <h3 className="font-display font-black text-xs text-slate-900 uppercase">
                  Your Run
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Real GPS tracking with strict anti-cheat verification.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                <div className="w-8 h-8 rounded-xl bg-lime-100 text-[#529d00] flex items-center justify-center font-bold text-sm mb-2">
                  2
                </div>
                <h3 className="font-display font-black text-xs text-slate-900 uppercase">
                  Your Crew
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Run clubs that build camaraderie and competitive energy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                <div className="w-8 h-8 rounded-xl bg-lime-100 text-[#529d00] flex items-center justify-center font-bold text-sm mb-2">
                  3
                </div>
                <h3 className="font-display font-black text-xs text-slate-900 uppercase">
                  Your City
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Push your city toward monthly goals on the regional map.
                </p>
              </div>
            </div>

            {/* Profile Check */}
            <div className="p-4 rounded-2xl bg-lime-50/50 border border-[#72D600]/30 flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-[#72D600]"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] font-mono text-slate-500">@{currentUser.username}</p>
                <p className="text-[10px] text-[#529d00] font-bold mt-0.5">Account Ready for Setup</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full h-12 rounded-2xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#72D600]/25 transition-all cursor-pointer"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: WHERE DO YOU RUN? */}
        {step === 2 && (
          <div className="pt-6 space-y-5 animate-in fade-in-50 slide-in-from-bottom-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-50 text-[#529d00] font-bold text-xs uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Step 2 of 4</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900">
                WHERE DO YOU RUN? 📍
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Select your State and City to unlock your local leaderboards and clubs.
              </p>
            </div>

            {/* Launch City Spotlight */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-[#72D600] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official Launch City</span>
              </div>
              <h3 className="text-lg font-display font-black mt-1">
                Chhatrapati Sambhajinagar
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Active league with 37+ Run Clubs and 67,400+ KM logged across Waluj, CIDCO, and Cannaught.
              </p>
            </div>

            {/* State & City Relational Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <select
                  value={selectedStateId}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#72D600]"
                >
                  {SUPPORTED_STATES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <select
                  value={selectedCityId}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#72D600]"
                >
                  {availableCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} {city.isLaunchCity ? '🔥 (Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Neighborhood picker */}
            {currentCityObj?.neighborhoods && currentCityObj.neighborhoods.length > 0 && (
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-xs">
                  Your Primary Neighborhood / Running Area
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#72D600]"
                >
                  {currentCityObj.neighborhoods.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 h-12 rounded-2xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#72D600]/25 transition-all cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FIND YOUR FAM (RUN CLUB SELECTION) */}
        {step === 3 && (
          <div className="pt-6 space-y-5 animate-in fade-in-50 slide-in-from-bottom-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-50 text-[#529d00] font-bold text-xs uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Step 3 of 4</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900">
                FIND YOUR FAM ⚡
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Join a local run club in {currentCityObj?.name}, or create your own crew.
              </p>
            </div>

            {/* Clubs List in Selected City */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {availableClubs.map((club) => {
                const isSelected = selectedClubId === club.id;
                return (
                  <div
                    key={club.id}
                    onClick={() => setSelectedClubId(isSelected ? null : club.id)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#72D600] bg-lime-50/70 shadow-sm ring-1 ring-[#72D600]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-display font-black text-slate-900 text-xs sm:text-sm">
                          {club.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span>{club.neighborhood}</span>
                          <span>•</span>
                          <span>{club.memberIds.length} members</span>
                          <span>•</span>
                          <span className="font-mono font-bold text-slate-700">
                            {club.monthlyDistanceKm.toFixed(0)} KM this mo
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-[#72D600] text-slate-950 font-black'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? 'JOINED ✓' : 'JOIN'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Options: Create a Run Club or Skip for Now */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreateClubModal(true)}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#529d00]" />
                <span>CREATE A RUN CLUB</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedClubId(null);
                  setStep(4);
                }}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold"
              >
                SKIP FOR NOW
              </button>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1 h-12 rounded-2xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#72D600]/25 transition-all cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: YOU'RE READY 🔥 */}
        {step === 4 && (
          <div className="pt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-50 text-[#529d00] font-bold text-xs uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>Step 4 of 4</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900">
                YOU'RE READY 🔥
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Your runner profile is verified and attached to your city league.
              </p>
            </div>

            {/* Final Profile Verification Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#72D600] shadow-md"
                />
                <div>
                  <h3 className="font-display font-black text-lg text-white">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs font-mono font-bold text-[#72D600]">
                    @{currentUser.username}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#72D600]" />
                    <span>{selectedNeighborhood}, {currentCityObj?.name}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    City & State
                  </span>
                  <span className="font-bold text-white mt-0.5 block truncate">
                    {currentCityObj?.name}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Primary Run Club
                  </span>
                  <span className="font-bold text-[#72D600] mt-0.5 block truncate">
                    {selectedClubId
                      ? availableClubs.find((c) => c.id === selectedClubId)?.name || 'Club Member'
                      : 'Independent Runner'}
                  </span>
                </div>
              </div>
            </div>

            {/* Enter RunFam Action */}
            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="w-full h-14 rounded-2xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-[#72D600]/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>ENTER RUNFAM</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>

      {/* Inline Create Run Club Modal */}
      {showCreateClubModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateClubSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs space-y-3.5 animate-in fade-in-50 zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-display font-black text-base text-slate-900">
                CREATE A NEW RUN CLUB
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateClubModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Club Name *
              </label>
              <input
                type="text"
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
                placeholder="e.g. Shendra Sunrise Runners"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Neighborhood / Area
              </label>
              <input
                type="text"
                value={newClubNeighborhood}
                onChange={(e) => setNewClubNeighborhood(e.target.value)}
                placeholder="e.g. Shendra MIDC"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Club Description
              </label>
              <textarea
                rows={2}
                value={newClubDescription}
                onChange={(e) => setNewClubDescription(e.target.value)}
                placeholder="What is your crew's mission and vibe?"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-bold text-xs"
              >
                CREATE & JOIN CLUB
              </button>
              <button
                type="button"
                onClick={() => setShowCreateClubModal(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
