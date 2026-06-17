import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCompanyStore, useAuthStore } from '../store';
import { Building2, Globe, MapPin, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/Common';

export const CompaniesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { companies, isLoading, error, fetchCompanies } = useCompanyStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies().catch(() => {});
  }, [fetchCompanies]);

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="companies-list">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            Employer Companies
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse corporate profiles, job hubs, and recruitment entities.
          </p>
        </div>
        
        {user?.role === 'RECRUITER' && (
          <Link
            to="/companies/create"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Company
          </Link>
        )}
      </div>

      {/* Filter search */}
      <div className="bg-white dark:bg-slate-900 justify-between items-center border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2.5 outline-none text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
          placeholder="Filter by company name or location..."
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} height="h-24" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchCompanies()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Companies Found"
          description="Be the first to register an employer profile database."
          action={
            user?.role === 'RECRUITER' ? (
              <Link to="/companies/create" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg">
                Create First Company
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((company) => (
            <div
              key={company.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      company.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-50">
                      <Link to={`/companies/${company.id}`} className="hover:text-indigo-600">
                        {company.name}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        {company.location}
                      </span>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-indigo-600"
                        >
                          <Globe className="w-3 h-3 text-indigo-500" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 mt-4 leading-relaxed bg-slate-50 dark:bg-slate-950/20 p-3 rounded-lg">
                  {company.description}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-4 flex justify-between items-center text-xs">
                <Link
                  to={`/companies/${company.id}`}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  View Jobs Directory
                </Link>

                {user?.role === 'RECRUITER' && company.recruiterId === user.id && (
                  <div className="flex gap-2">
                    <Link
                      to={`/companies/${company.id}/edit`}
                      className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                    >
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activeCompany, fetchCompanyById, deleteCompany, isLoading, error } = useCompanyStore();

  useEffect(() => {
    if (id) fetchCompanyById(id).catch(() => {});
  }, [id, fetchCompanyById]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this company profile?')) return;
    try {
      await deleteCompany(id);
      navigate('/companies');
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (isLoading) return <LoadingSkeleton count={3} />;
  if (error || !activeCompany) return <ErrorState message={error || 'Company not loaded.'} onRetry={() => id && fetchCompanyById(id)} />;

  return (
    <div className="space-y-6" id="company-detail">
      <Link to="/companies" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to companies directory
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-xl text-slate-400 border border-slate-200">
              {activeCompany.logo ? (
                <img src={activeCompany.logo} alt={activeCompany.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                activeCompany.name.charAt(0)
              )}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{activeCompany.name}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  {activeCompany.location}
                </span>
                {activeCompany.website && (
                  <a href={activeCompany.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    {activeCompany.website}
                  </a>
                )}
              </div>
            </div>
          </div>

          {user?.role === 'RECRUITER' && activeCompany.recruiterId === user.id && (
            <div className="flex gap-2">
              <Link
                to={`/companies/${activeCompany.id}/edit`}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold inline-flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Profile
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-slate-50">About the Employer</h2>
          <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-normal whitespace-pre-wrap">
            {activeCompany.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const CompanyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createCompany, isLoading, error } = useCompanyStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const company = await createCompany({ name, description, website, location, logo });
      navigate(`/companies/${company.id}`);
    } catch (err) {
      // Caught in store
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto" id="company-create">
      <Link to="/companies" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to directory
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Register New Company</h1>
          <p className="text-xs text-slate-400 mt-1">Configure your corporate identity credentials below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="p-3 bg-red-100 text-red-700 text-xs rounded">{error}</p>}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              placeholder="e.g. Acme Corporation"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Corporate Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
                placeholder="https://acme.org"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Headquarters Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
                placeholder="e.g. San Francisco, US"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Logo Image Link URL</label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              placeholder="https://images.unsplash.com/.../logo"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Employer Profile Narrative</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent min-h-[120px]"
              placeholder="Provide a narrative detailing company history, mission, and work environment..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition"
          >
            {isLoading ? 'Registering Company Entity...' : 'Create Corporate Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const CompanyEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeCompany, fetchCompanyById, updateCompany, isLoading, error } = useCompanyStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    if (id) {
      fetchCompanyById(id).then((company) => {
        setName(company.name);
        setDescription(company.description);
        setWebsite(company.website || '');
        setLocation(company.location);
        setLogo(company.logo || '');
      }).catch(() => {});
    }
  }, [id, fetchCompanyById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateCompany(id, { name, description, website, location, logo });
      navigate(`/companies/${id}`);
    } catch (err) {
      // Error is stored
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto" id="company-edit">
      <Link to={`/companies/${id}`} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to profile
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Edit Company Profile</h1>
          <p className="text-xs text-slate-400 mt-1">Revise company parameters below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="p-3 bg-red-100 text-red-700 text-xs rounded">{error}</p>}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Corporate Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Headquarters Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Logo Image URL</label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Narrative Detail</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent min-h-[120px]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition"
          >
            {isLoading ? 'Publishing changes...' : 'Publish Corporate Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
