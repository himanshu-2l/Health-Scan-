/**
 * Patient Profile Page
 * Comprehensive patient profile with personal info, medications, medical history, etc.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GlassNavbar } from '@/components/GlassNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Pill,
  AlertTriangle,
  History,
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  FileText,
  Heart,
  Activity,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import {
  getPatientProfile,
  updatePatientProfile,
  addMedication,
  updateMedication,
  deleteMedication,
  addAllergy,
  updateAllergy,
  deleteAllergy,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  addMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
  createPatientProfile,
  PatientProfile,
  Medication,
  Allergy,
  EmergencyContact,
  MedicalHistory
} from '@/services/patientProfileService';
import { getAllResults } from '@/services/healthDataService';
import { getAllBPReadings } from '@/services/bpService';
import { format, parseISO } from 'date-fns';

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'medications' | 'allergies' | 'history' | 'contacts' | 'insurance'>('overview');
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [editingHistory, setEditingHistory] = useState<MedicalHistory | null>(null);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showHistoryForm, setShowHistoryForm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    let currentProfile = getPatientProfile();
    if (!currentProfile) {
      // Create default profile
      currentProfile = createPatientProfile({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'prefer-not-to-say',
      });
      savePatientProfile(currentProfile);
    }
    setProfile(currentProfile);
  };

  const saveProfile = () => {
    if (!profile) return;
    if (updatePatientProfile(profile)) {
      setIsEditing(false);
      loadProfile();
    }
  };

  const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;
    try {
      const birthDate = parseISO(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  };

  const getHealthStats = () => {
    const reports = getAllResults();
    const bpReadings = getAllBPReadings();
    const activeMeds = profile?.medications.filter(m => m.isActive) || [];
    const activeAllergies = profile?.allergies || [];
    
    return {
      totalReports: reports.length,
      totalBPReadings: bpReadings.length,
      activeMedications: activeMeds.length,
      allergies: activeAllergies.length,
      recentReport: reports.length > 0 ? reports[0] : null,
      recentBP: bpReadings.length > 0 ? bpReadings[0] : null,
    };
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <GlassNavbar />
        <div className="flex items-center justify-center min-h-screen pt-24">
          <div className="text-center">
            <Activity className="w-12 h-12 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = getHealthStats();
  const age = calculateAge(profile.dateOfBirth);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <GlassNavbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12 flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-600 dark:border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profile.firstName?.[0]?.toUpperCase() || profile.lastName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {profile.firstName || profile.lastName 
                      ? `${profile.firstName} ${profile.lastName}`.trim()
                      : 'Patient Profile'}
                  </h1>
                  {age && (
                    <p className="text-gray-600 dark:text-gray-300">
                      {age} years old • {profile.gender !== 'prefer-not-to-say' ? profile.gender : ''}
                      {profile.bloodGroup && ` • Blood Group: ${profile.bloodGroup}`}
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "default" : "outline"}
                className={isEditing ? "bg-green-600 hover:bg-green-700 text-white" : ""}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Health Reports</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalReports}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">BP Readings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalBPReadings}</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Active Medications</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.activeMedications}</p>
                  </div>
                  <Pill className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Allergies</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.allergies}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'medications', label: 'Medications', icon: Pill },
                  { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
                  { id: 'history', label: 'Medical History', icon: History },
                  { id: 'contacts', label: 'Emergency Contacts', icon: Users },
                  { id: 'insurance', label: 'Insurance', icon: Shield },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <CardContent className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          First Name
                        </label>
                        {isEditing ? (
                          <Input
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100">{profile.firstName || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last Name
                        </label>
                        {isEditing ? (
                          <Input
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100">{profile.lastName || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Date of Birth
                        </label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={profile.dateOfBirth}
                            onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100">
                            {profile.dateOfBirth ? format(parseISO(profile.dateOfBirth), 'MMMM dd, yyyy') : 'Not provided'}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Gender
                        </label>
                        {isEditing ? (
                          <select
                            value={profile.gender}
                            onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100 capitalize">{profile.gender.replace('-', ' ')}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Blood Group
                        </label>
                        {isEditing ? (
                          <Input
                            value={profile.bloodGroup || ''}
                            onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                            placeholder="e.g., O+, A-, B+"
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100">{profile.bloodGroup || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone
                        </label>
                        {isEditing ? (
                          <Input
                            type="tel"
                            value={profile.phone || ''}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {profile.phone || 'Not provided'}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={profile.email || ''}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {profile.email || 'Not provided'}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Address
                        </label>
                        {isEditing ? (
                          <Input
                            value={profile.address || ''}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {profile.address || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <Button onClick={saveProfile} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Access</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link to="/reports">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">View All Reports</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{stats.totalReports} reports available</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </CardContent>
                        </Card>
                      </Link>
                      <Link to="/bp-tracker">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">BP Tracker</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{stats.totalBPReadings} readings recorded</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Medications Tab */}
              {activeTab === 'medications' && (
                <MedicationsSection
                  medications={profile.medications}
                  onAdd={() => setShowMedicationForm(true)}
                  onEdit={(med) => {
                    setEditingMedication(med);
                    setShowMedicationForm(true);
                  }}
                  onDelete={(id) => {
                    deleteMedication(id);
                    loadProfile();
                  }}
                  showForm={showMedicationForm}
                  editingMedication={editingMedication}
                  onClose={() => {
                    setShowMedicationForm(false);
                    setEditingMedication(null);
                  }}
                  onSave={(med) => {
                    if (editingMedication) {
                      updateMedication(editingMedication.id, med);
                    } else {
                      addMedication(med);
                    }
                    loadProfile();
                    setShowMedicationForm(false);
                    setEditingMedication(null);
                  }}
                />
              )}

              {/* Allergies Tab */}
              {activeTab === 'allergies' && (
                <AllergiesSection
                  allergies={profile.allergies}
                  onAdd={() => setShowAllergyForm(true)}
                  onEdit={(allergy) => {
                    setEditingAllergy(allergy);
                    setShowAllergyForm(true);
                  }}
                  onDelete={(id) => {
                    deleteAllergy(id);
                    loadProfile();
                  }}
                  showForm={showAllergyForm}
                  editingAllergy={editingAllergy}
                  onClose={() => {
                    setShowAllergyForm(false);
                    setEditingAllergy(null);
                  }}
                  onSave={(allergy) => {
                    if (editingAllergy) {
                      updateAllergy(editingAllergy.id, allergy);
                    } else {
                      addAllergy(allergy);
                    }
                    loadProfile();
                    setShowAllergyForm(false);
                    setEditingAllergy(null);
                  }}
                />
              )}

              {/* Medical History Tab */}
              {activeTab === 'history' && (
                <MedicalHistorySection
                  history={profile.medicalHistory}
                  onAdd={() => setShowHistoryForm(true)}
                  onEdit={(history) => {
                    setEditingHistory(history);
                    setShowHistoryForm(true);
                  }}
                  onDelete={(id) => {
                    deleteMedicalHistory(id);
                    loadProfile();
                  }}
                  showForm={showHistoryForm}
                  editingHistory={editingHistory}
                  onClose={() => {
                    setShowHistoryForm(false);
                    setEditingHistory(null);
                  }}
                  onSave={(history) => {
                    if (editingHistory) {
                      updateMedicalHistory(editingHistory.id, history);
                    } else {
                      addMedicalHistory(history);
                    }
                    loadProfile();
                    setShowHistoryForm(false);
                    setEditingHistory(null);
                  }}
                />
              )}

              {/* Emergency Contacts Tab */}
              {activeTab === 'contacts' && (
                <EmergencyContactsSection
                  contacts={profile.emergencyContacts}
                  onAdd={() => setShowContactForm(true)}
                  onEdit={(contact) => {
                    setEditingContact(contact);
                    setShowContactForm(true);
                  }}
                  onDelete={(id) => {
                    deleteEmergencyContact(id);
                    loadProfile();
                  }}
                  showForm={showContactForm}
                  editingContact={editingContact}
                  onClose={() => {
                    setShowContactForm(false);
                    setEditingContact(null);
                  }}
                  onSave={(contact) => {
                    if (editingContact) {
                      updateEmergencyContact(editingContact.id, contact);
                    } else {
                      addEmergencyContact(contact);
                    }
                    loadProfile();
                    setShowContactForm(false);
                    setEditingContact(null);
                  }}
                />
              )}

              {/* Insurance Tab */}
              {activeTab === 'insurance' && (
                <InsuranceSection
                  profile={profile}
                  isEditing={isEditing}
                  onUpdate={(updates) => {
                    setProfile({ ...profile, ...updates });
                  }}
                  onSave={saveProfile}
                />
              )}
            </CardContent>
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}

// Medications Section Component
function MedicationsSection({ medications, onAdd, onEdit, onDelete, showForm, editingMedication, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    startDate: '',
    endDate: '',
    prescribedBy: '',
    notes: '',
    isActive: true,
  });

  useEffect(() => {
    if (editingMedication) {
      setFormData({
        name: editingMedication.name,
        dosage: editingMedication.dosage,
        frequency: editingMedication.frequency,
        startDate: editingMedication.startDate,
        endDate: editingMedication.endDate || '',
        prescribedBy: editingMedication.prescribedBy || '',
        notes: editingMedication.notes || '',
        isActive: editingMedication.isActive,
      });
    } else {
      setFormData({
        name: '',
        dosage: '',
        frequency: 'Once daily',
        startDate: '',
        endDate: '',
        prescribedBy: '',
        notes: '',
        isActive: true,
      });
    }
  }, [editingMedication, showForm]);

  const handleSave = () => {
    onSave({
      ...formData,
      endDate: formData.endDate || undefined,
      prescribedBy: formData.prescribedBy || undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Current Medications</h3>
        <Button onClick={onAdd} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gray-50 dark:bg-gray-700 border-2 border-purple-500 dark:border-purple-600">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              {editingMedication ? 'Edit Medication' : 'Add New Medication'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medication Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Metformin"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dosage *</label>
                <Input
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="e.g., 500mg"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency *</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>Four times daily</option>
                  <option>As needed</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date (if applicable)</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prescribed By</label>
                <Input
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  placeholder="Doctor's name"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Currently taking this medication</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={onClose} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {medications.length === 0 ? (
        <Card className="bg-gray-50 dark:bg-gray-700">
          <CardContent className="py-8 text-center">
            <Pill className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-300">No medications recorded yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {medications.map((med: Medication) => (
            <Card key={med.id} className={`bg-white dark:bg-gray-800 ${med.isActive ? 'border-l-4 border-purple-500' : 'border-l-4 border-gray-300'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{med.name}</h4>
                      {med.isActive && (
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Active</Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <p><strong>Dosage:</strong> {med.dosage}</p>
                      <p><strong>Frequency:</strong> {med.frequency}</p>
                      <p><strong>Started:</strong> {format(parseISO(med.startDate), 'MMM dd, yyyy')}</p>
                      {med.endDate && <p><strong>End Date:</strong> {format(parseISO(med.endDate), 'MMM dd, yyyy')}</p>}
                      {med.prescribedBy && <p><strong>Prescribed by:</strong> {med.prescribedBy}</p>}
                      {med.notes && <p><strong>Notes:</strong> {med.notes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(med)}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this medication?')) {
                          onDelete(med.id);
                        }
                      }}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Allergies Section Component
function AllergiesSection({ allergies, onAdd, onEdit, onDelete, showForm, editingAllergy, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    allergen: '',
    reaction: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe',
    notes: '',
  });

  useEffect(() => {
    if (editingAllergy) {
      setFormData({
        allergen: editingAllergy.allergen,
        reaction: editingAllergy.reaction,
        severity: editingAllergy.severity,
        notes: editingAllergy.notes || '',
      });
    } else {
      setFormData({
        allergen: '',
        reaction: '',
        severity: 'mild',
        notes: '',
      });
    }
  }, [editingAllergy, showForm]);

  const handleSave = () => {
    onSave({
      ...formData,
      notes: formData.notes || undefined,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'moderate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Allergies</h3>
        <Button onClick={onAdd} className="bg-yellow-600 hover:bg-yellow-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Allergy
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gray-50 dark:bg-gray-700 border-2 border-yellow-500 dark:border-yellow-600">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              {editingAllergy ? 'Edit Allergy' : 'Add New Allergy'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allergen *</label>
                <Input
                  value={formData.allergen}
                  onChange={(e) => setFormData({ ...formData, allergen: e.target.value })}
                  placeholder="e.g., Penicillin, Peanuts"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reaction *</label>
                <Input
                  value={formData.reaction}
                  onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
                  placeholder="e.g., Rash, Difficulty breathing"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity *</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={onClose} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {allergies.length === 0 ? (
        <Card className="bg-gray-50 dark:bg-gray-700">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-300">No allergies recorded</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allergies.map((allergy: Allergy) => (
            <Card key={allergy.id} className="bg-white dark:bg-gray-800 border-l-4 border-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{allergy.allergen}</h4>
                      <Badge className={getSeverityColor(allergy.severity)}>
                        {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <p><strong>Reaction:</strong> {allergy.reaction}</p>
                      {allergy.notes && <p><strong>Notes:</strong> {allergy.notes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(allergy)}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this allergy?')) {
                          onDelete(allergy.id);
                        }
                      }}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Medical History Section Component
function MedicalHistorySection({ history, onAdd, onEdit, onDelete, showForm, editingHistory, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    condition: '',
    diagnosisDate: '',
    status: 'active' as 'active' | 'resolved' | 'chronic',
    notes: '',
  });

  useEffect(() => {
    if (editingHistory) {
      setFormData({
        condition: editingHistory.condition,
        diagnosisDate: editingHistory.diagnosisDate,
        status: editingHistory.status,
        notes: editingHistory.notes || '',
      });
    } else {
      setFormData({
        condition: '',
        diagnosisDate: '',
        status: 'active',
        notes: '',
      });
    }
  }, [editingHistory, showForm]);

  const handleSave = () => {
    onSave({
      ...formData,
      notes: formData.notes || undefined,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'chronic': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Medical History</h3>
        <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Condition
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gray-50 dark:bg-gray-700 border-2 border-blue-500 dark:border-blue-600">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              {editingHistory ? 'Edit Medical History' : 'Add Medical Condition'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition *</label>
                <Input
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  placeholder="e.g., Diabetes Type 2"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diagnosis Date *</label>
                <Input
                  type="date"
                  value={formData.diagnosisDate}
                  onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="chronic">Chronic</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={onClose} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {history.length === 0 ? (
        <Card className="bg-gray-50 dark:bg-gray-700">
          <CardContent className="py-8 text-center">
            <History className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-300">No medical history recorded</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((item: MedicalHistory) => (
            <Card key={item.id} className="bg-white dark:bg-gray-800 border-l-4 border-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.condition}</h4>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <p><strong>Diagnosed:</strong> {format(parseISO(item.diagnosisDate), 'MMM dd, yyyy')}</p>
                      {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this medical history entry?')) {
                          onDelete(item.id);
                        }
                      }}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Emergency Contacts Section Component
function EmergencyContactsSection({ contacts, onAdd, onEdit, onDelete, showForm, editingContact, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: false,
  });

  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name,
        relationship: editingContact.relationship,
        phone: editingContact.phone,
        email: editingContact.email || '',
        isPrimary: editingContact.isPrimary,
      });
    } else {
      setFormData({
        name: '',
        relationship: '',
        phone: '',
        email: '',
        isPrimary: false,
      });
    }
  }, [editingContact, showForm]);

  const handleSave = () => {
    onSave({
      ...formData,
      email: formData.email || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Emergency Contacts</h3>
        <Button onClick={onAdd} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gray-50 dark:bg-gray-700 border-2 border-green-500 dark:border-green-600">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relationship *</label>
                <Input
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="e.g., Spouse, Parent"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPrimary}
                onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Set as primary emergency contact</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={onClose} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {contacts.length === 0 ? (
        <Card className="bg-gray-50 dark:bg-gray-700">
          <CardContent className="py-8 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-300">No emergency contacts added</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact: EmergencyContact) => (
            <Card key={contact.id} className={`bg-white dark:bg-gray-800 ${contact.isPrimary ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{contact.name}</h4>
                      {contact.isPrimary && (
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Primary</Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <p><strong>Relationship:</strong> {contact.relationship}</p>
                      <p><strong>Phone:</strong> {contact.phone}</p>
                      {contact.email && <p><strong>Email:</strong> {contact.email}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(contact)}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this emergency contact?')) {
                          onDelete(contact.id);
                        }
                      }}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Insurance Section Component
function InsuranceSection({ profile, isEditing, onUpdate, onSave }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Insurance Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance Provider</label>
          {isEditing ? (
            <Input
              value={profile.insuranceProvider || ''}
              onChange={(e) => onUpdate({ insuranceProvider: e.target.value })}
              placeholder="e.g., Blue Cross Blue Shield"
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          ) : (
            <p className="text-gray-900 dark:text-gray-100">{profile.insuranceProvider || 'Not provided'}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Policy Number</label>
          {isEditing ? (
            <Input
              value={profile.insurancePolicyNumber || ''}
              onChange={(e) => onUpdate({ insurancePolicyNumber: e.target.value })}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          ) : (
            <p className="text-gray-900 dark:text-gray-100">{profile.insurancePolicyNumber || 'Not provided'}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Number</label>
          {isEditing ? (
            <Input
              value={profile.insuranceGroupNumber || ''}
              onChange={(e) => onUpdate({ insuranceGroupNumber: e.target.value })}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          ) : (
            <p className="text-gray-900 dark:text-gray-100">{profile.insuranceGroupNumber || 'Not provided'}</p>
          )}
        </div>
      </div>
      {isEditing && (
        <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      )}
    </div>
  );
}





