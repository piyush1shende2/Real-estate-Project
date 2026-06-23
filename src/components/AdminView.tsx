import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Database, 
  Activity, 
  Trash2, 
  Search, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  Grid,
  FileSpreadsheet,
  Layers,
  Sparkles,
  MessageSquare,
  Bot,
  Upload,
  CheckCircle2,
  FileText,
  Check,
  Flame,
  UserCheck,
  Map,
  TrendingUp,
  Briefcase,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  Compass,
  Trophy,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { TabType } from '../types';
import SheetsView from './SheetsView';
import AdminHeatMapHub from './AdminHeatMapHub';
import { getTrackedActions, clearTrackedActions, TrackedAction, getConsent } from '../lib/vts';

interface AdminViewProps {
  onBackToHome: () => void;
}

interface LeadEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: 'Buy' | 'Sell' | 'Rent' | 'Plot' | 'PG/Co-Living' | 'Home Loan';
  status: 'Pending' | 'Contacted' | 'Verified';
  timestamp: string;
  notes: string;
}

export default function AdminView({ onBackToHome }: AdminViewProps) {
  // Toast notifications trigger
  const [toastText, setToastText] = useState<string | null>(null);
  const triggerToast = (text: string) => {
    setToastText(text);
    setTimeout(() => setToastText(null), 3000);
  };

  // Administrative Authentication States matching mockup screenshot
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [logInEmail, setLogInEmail] = useState('');
  const [logInPassword, setLogInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLogInPassword, setShowLogInPassword] = useState(false);

  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    onBackToHome();
  };

  const handleLogInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logInEmail.trim() || !logInPassword.trim()) {
      triggerToast('⚠️ Please fill in all login fields.');
      return;
    }
    setIsAdminLoggedIn(true);
    triggerToast('🔑 Administrative Access Granted! Opening Admin Hub Console.');
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail.trim() || !signUpPassword.trim() || !signUpConfirmPassword.trim()) {
      triggerToast('⚠️ Please fill in all registration fields.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      triggerToast('❌ Passwords do not match.');
      return;
    }
    setIsAdminLoggedIn(true);
    triggerToast('🔑 New Administrator Registered & Logged In!');
  };

  const handleGoogleAuth = () => {
    setIsAdminLoggedIn(true);
    triggerToast('🔑 Logged in securely using Google Admin Account!');
  };

  // Active Menu Tab Controller (Requested 7 primary professional options)
  const [activeTab, setActiveTab] = useState<'users' | 'properties' | 'visitor_analytics' | 'heatmap' | 'leads' | 'agents' | 'reports'>('users');

  // Static global counters simulation
  const [visitorsCount, setVisitorsCount] = useState(1480);
  const [roiCalculations, setRoiCalculations] = useState(412);
  const [chatBotHits, setChatBotHits] = useState(865);
  const [syncCount, setSyncCount] = useState(148);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSheets, setShowSheets] = useState(false);

  // Left Sidebar Navigation Display Controller States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Stats chart interactive hover managers
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  // ---------------------------------------------------------------------------
  // 1. TOTAL USERS STATE & HANDLERS
  // ---------------------------------------------------------------------------
  const [users, setUsers] = useState<any[]>([
    { id: 'U-001', name: 'Admin Piyush Shende', email: 'atg.piyushshende@gmail.com', role: 'Admin', status: 'Online', joins: '2026-04-18', sessions: 245, consent: 'Accepted' },
    { id: 'U-309', name: 'Alok Deshpande', email: 'alok.d@gmail.com', role: 'Buyer', status: 'Active', joins: '2026-05-12', sessions: 28, consent: 'Accepted' },
    { id: 'U-402', name: 'Nisha Soni', email: 'nisha.soni@outlook.com', role: 'Landlord', status: 'Offline', joins: '2026-06-01', sessions: 15, consent: 'Rejected' },
    { id: 'U-112', name: 'Vikram Phadnis', email: 'v.phadnis@gmail.com', role: 'Seller', status: 'Active', joins: '2026-03-24', sessions: 42, consent: 'Accepted' },
    { id: 'U-501', name: 'Sameer Sen', email: 'sameers@yahoo.com', role: 'Broker', status: 'Suspended', joins: '2026-01-10', sessions: 3, consent: 'Rejected' }
  ]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Buyer' | 'Seller' | 'Landlord' | 'Broker' | 'Admin'>('Buyer');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      triggerToast('⚠️ User Name and Email are required.');
      return;
    }
    const newUser = {
      id: `U-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
      joins: new Date().toISOString().split('T')[0],
      sessions: 1,
      consent: 'Accepted'
    };
    setUsers([newUser, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    triggerToast(`👤 Live User Account "${newUser.name}" successfully created!`);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' || u.status === 'Online' ? 'Suspended' : 'Active' } : u));
    triggerToast('⚡ User registration status toggled.');
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers(users.filter(u => u.id !== id));
    triggerToast(`🗑️ User Account "${name}" purged.`);
  };

  // ---------------------------------------------------------------------------
  // 2. TOTAL PROPERTIES STATE & HANDLERS
  // ---------------------------------------------------------------------------
  const [properties, setProperties] = useState<any[]>([
    { id: 'P-101', title: 'Luxury 3 BHK Flat - Godrej Anandam', location: 'Ganeshpeth, Nagpur', price: '₹1.10 Cr', type: 'Buy', bhk: '3 BHK', area: '1650 sq ft', status: 'Approved', featured: true, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80' },
    { id: 'P-102', title: 'Resale 2 BHK Flat', location: 'Dharampeth, Nagpur', price: '₹65 Lakhs', type: 'Buy', bhk: '2 BHK', area: '1100 sq ft', status: 'Approved', featured: false, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
    { id: 'P-103', title: 'Premium Apartment', location: 'Trimurti Nagar, Nagpur', price: '₹18,000 / month', type: 'Rent', bhk: '2 BHK', area: '1000 sq ft', status: 'Approved', featured: true, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80' },
    { id: 'P-104', title: 'Fully Furnished Girls PG Room', location: 'Ramdaspeth, Nagpur', price: '₹8,500 / month', type: 'PG/Co-Living', bhk: 'Single Occupancy', area: '180 sq ft', status: 'Approved', featured: false, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80' },
    { id: 'P-105', title: 'Commercial Layout Plot', location: 'Wardha Road, Nagpur', price: '₹4,500 / sq ft', type: 'Plots', bhk: 'N/A', area: '2500 sq ft', status: 'Pending Approval', featured: false, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' }
  ]);
  const [propTypeFilter, setPropTypeFilter] = useState<'all' | 'Buy' | 'Rent' | 'Plots' | 'PG/Co-Living'>('all');
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropLoc, setNewPropLoc] = useState('');
  const [newPropPrice, setNewPropPrice] = useState('');
  const [newPropType, setNewPropType] = useState<'Buy' | 'Rent' | 'Plots' | 'PG/Co-Living'>('Buy');

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropTitle.trim() || !newPropPrice.trim()) {
      triggerToast('⚠️ Title and Price are required for listing.');
      return;
    }
    const newProp = {
      id: `P-${Math.floor(200 + Math.random() * 800)}`,
      title: newPropTitle,
      location: newPropLoc || 'Nagpur, MH',
      price: newPropPrice,
      type: newPropType,
      bhk: newPropType === 'Plots' ? 'N/A' : '3 BHK',
      area: '1200 sq ft',
      status: 'Approved',
      featured: false,
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=400&q=80'
    };
    setProperties([newProp, ...properties]);
    setNewPropTitle('');
    setNewPropLoc('');
    setNewPropPrice('');
    triggerToast(`🏠 Property "${newProp.title}" listed in active registry!`);
  };

  const handleTogglePropertyFeature = (id: string) => {
    setProperties(properties.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
    triggerToast('⭐ Listing featured parameters updated.');
  };

  const handleApproveProperty = (id: string) => {
    setProperties(properties.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
    triggerToast('✅ Property approved for customer display.');
  };

  const handleDeleteProperty = (id: string, title: string) => {
    setProperties(properties.filter(p => p.id !== id));
    triggerToast(`🗑️ Removed listing "${title}".`);
  };


  // ---------------------------------------------------------------------------
  // 3. VISITOR ANALYTICS STATE & FOOTPRINTS (VTS)
  // ---------------------------------------------------------------------------
  const [vtsActions, setVtsActions] = useState<TrackedAction[]>([]);
  useEffect(() => {
    const loadVts = () => setVtsActions(getTrackedActions());
    loadVts();
    window.addEventListener('vts_action_tracked', loadVts);
    window.addEventListener('vts_consent_updated', loadVts);
    return () => {
      window.removeEventListener('vts_action_tracked', loadVts);
      window.removeEventListener('vts_consent_updated', loadVts);
    };
  }, []);


  // ---------------------------------------------------------------------------
  // 4. LEADS MANAGEMENT STATE & XLSX SPREADSHEET ENGINE
  // ---------------------------------------------------------------------------
  const [leads, setLeads] = useState<LeadEntry[]>([
    { id: 'L-9812', name: 'Rohan Deshmukh', email: 'rohan.d@gmail.com', phone: '+91 98451 22891', interest: 'Buy', status: 'Verified', timestamp: '2026-06-02 10:14', notes: 'Interested in 3 BHK flat in Manish Nagar, Nagpur.' },
    { id: 'L-8721', name: 'Priya Sharma', email: 'priyas@outlook.com', phone: '+91 88721 00394', interest: 'Home Loan', status: 'Pending', timestamp: '2026-06-02 09:44', notes: 'Inquiry for SBI Home Loan Interest rate calculator.' },
    { id: 'L-7629', name: 'Amit Patel', email: 'amit.patel@yahoo.com', phone: '+91 76294 88319', interest: 'Plot', status: 'Contacted', timestamp: '2026-06-01 17:05', notes: 'Wants to view standard commercial plots near Wardha Road.' },
    { id: 'L-6211', name: 'Sneha Joshi', email: 'sneha.joshi@gmail.com', phone: '+91 90112 43105', interest: 'PG/Co-Living', status: 'Pending', timestamp: '2026-06-01 12:20', notes: 'Looking for girls PG near Dharampeth with laundry facilities.' },
    { id: 'L-4420', name: 'Vijay Wankhede', email: 'vj.wankhede@rediffmail.com', phone: '+91 93220 89100', interest: 'Sell', status: 'Contacted', timestamp: '2026-05-31 15:30', notes: 'wants to list 1500 sq ft house for sale.' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInterest, setFilterInterest] = useState<'all' | LeadEntry['interest']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | LeadEntry['status']>('all');

  // Leads creation sandbox
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newInterest, setNewInterest] = useState<LeadEntry['interest']>('Buy');
  const [newNotes, setNewNotes] = useState('');

  // Spreadsheet Upload States
  const [file, setFile] = useState<File | null>(null);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [fileRows, setFileRows] = useState<any[][]>([]);
  const [destTarget, setDestTarget] = useState<'sheets_tab' | 'leads_db'>('leads_db');
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Field Mapping Indicators
  const [leadMap, setLeadMap] = useState({ name: 0, email: 1, phone: 2, interest: 3, notes: 4 });

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadSuccessMsg(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataBytes = e.target?.result;
        if (!dataBytes) return;
        const workbook = XLSX.read(dataBytes, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
        if (rawRows.length === 0) {
          alert('Spreadsheet is empty.');
          return;
        }
        const headers = (rawRows[0] || []).map((h: any) => String(h || '').trim());
        const rows = rawRows.slice(1);
        setFileHeaders(headers);
        setFileRows(rows);

        // Auto Map Headers
        const newMap = { name: 0, email: 1, phone: 2, interest: 3, notes: 4 };
        headers.forEach((h, i) => {
          const l = h.toLowerCase();
          if (l.includes('name') || l.includes('client')) newMap.name = i;
          if (l.includes('email') || l.includes('mail')) newMap.email = i;
          if (l.includes('phone') || l.includes('number')) newMap.phone = i;
          if (l.includes('interest') || l.includes('type')) newMap.interest = i;
          if (l.includes('note') || l.includes('message') || l.includes('query')) newMap.notes = i;
        });
        setLeadMap(newMap);
      } catch (err: any) {
        alert('Failed parsing spreadsheet: ' + err.message);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleCommitDataset = () => {
    if (!file || fileHeaders.length === 0) {
      alert("Please select and parse a spreadsheet first.");
      return;
    }
    if (destTarget === 'sheets_tab') {
      triggerToast(`🎉 Worksheet loaded into Sheet Workspace!`);
    } else {
      const newLeads = fileRows.map((row, idx) => {
        return {
          id: `L-IMP-${Math.floor(Math.random() * 9000)}-${idx}`,
          name: String(row[leadMap.name] || `Imported Client ${idx + 1}`),
          email: String(row[leadMap.email] || `email-${idx}@imported.com`),
          phone: String(row[leadMap.phone] || `+91 90000 00000`),
          interest: 'Buy' as const,
          status: 'Pending' as const,
          timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
          notes: String(row[leadMap.notes] || 'Imported via CSV/Excel Database file.')
        };
      });
      setLeads(prev => [...newLeads, ...prev]);
      setUploadSuccessMsg(`Successfully integrated ${newLeads.length} leads from spreadsheet into database!`);
      triggerToast(`🎉 Integrated ${newLeads.length} imported leads.`);
    }
    setFile(null);
    setFileHeaders([]);
    setFileRows([]);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      triggerToast('⚠️ Please write customer Name and Email.');
      return;
    }
    const entry: LeadEntry = {
      id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      email: newEmail,
      phone: newPhone || 'Not specified',
      interest: newInterest,
      status: 'Pending',
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
      notes: newNotes || 'Direct manual testing ingestion'
    };
    setLeads([entry, ...leads]);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
    triggerToast(`🎉 Lead created and queued into Nagpur RERA Inbox.`);
  };

  const handleDeleteLead = (id: string, name: string) => {
    setLeads(leads.filter(l => l.id !== id));
    triggerToast(`🗑️ Lead ID ${id} (${name}) deleted.`);
  };

  const updateLeadStatus = (id: string, status: LeadEntry['status']) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    triggerToast(`💼 Status updated to ${status}`);
  };


  // ---------------------------------------------------------------------------
  // 5. AGENT MANAGEMENT STATE (WhatsApp click dispatches & Chatbot inspector transcripts)
  // ---------------------------------------------------------------------------
  const [agents, setAgents] = useState<any[]>([
    { id: 'AG-01', name: 'Meena Golhar', email: 'meena.g@urban-nest.com', specialization: 'PG & Co-Living', rating: 4.8, activeInquiries: 24, status: 'Active', whatsapp: '+91 98231 00412' },
    { id: 'AG-02', name: 'Aditya Sen', email: 'aditya.s@urban-nest.com', specialization: 'Plots & Resales', rating: 4.9, activeInquiries: 36, status: 'Active', whatsapp: '+91 88721 00394' },
    { id: 'AG-03', name: 'Radhika Nair', email: 'radhika.n@urban-nest.com', specialization: 'Premium Apartments', rating: 4.7, activeInquiries: 18, status: 'Active', whatsapp: '+91 93220 89100' },
    { id: 'AG-04', name: 'Pranay Raut', email: 'pranay.r@urban-nest.com', specialization: 'Home Loans & Legal', rating: 4.6, activeInquiries: 15, status: 'Away', whatsapp: '+91 90112 43105' }
  ]);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentSpec, setNewAgentSpec] = useState('Premium Apartments');

  const [whatsappChats, setWhatsappChats] = useState<any[]>([
    { id: 'WA-4932', name: 'Rohit Deshpande', city: 'Pune', message: 'Interested in plots near Wardha Road Nagpur.', agent: 'Meena Golhar', timestamp: '2026-06-01 10:15' },
    { id: 'WA-8311', name: 'Sujata Kulkarni', city: 'Nagpur', message: 'Looking for a PG housing near Shankar Nagar.', agent: 'Aditya Sen', timestamp: '2026-06-02 02:30' }
  ]);
  const [chatbotSessions, setChatbotSessions] = useState<any[]>([
    {
      id: 'session_1',
      name: 'User Inquiry (Ramdaspeth Resale)',
      persona: 'friendly',
      messages: [
        { role: 'user', content: 'Do you have owner listed 3BHK flats near Ramdaspeth under 80 Lakhs?', timestamp: new Date().toISOString() },
        { role: 'assistant', content: 'Yes! We found a beautiful semi-furnished 3BHK property with immediate possession in Ramdaspeth listed for 76L. Shall I arrange a call with the relationship executive?', timestamp: new Date().toISOString() }
      ]
    }
  ]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentEmail.trim()) {
      triggerToast('⚠️ Agent Name and Email are required.');
      return;
    }
    const newAg = {
      id: `AG-0${agents.length + 1}`,
      name: newAgentName,
      email: newAgentEmail,
      specialization: newAgentSpec,
      rating: 5.0,
      activeInquiries: 0,
      status: 'Active',
      whatsapp: '+91 91122 33445'
    };
    setAgents([...agents, newAg]);
    setNewAgentName('');
    setNewAgentEmail('');
    triggerToast(`⭐ New broker agent "${newAg.name}" approved.`);
  };

  const toggleAgentStatus = (id: string) => {
    setAgents(agents.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Away' : 'Active' } : a));
    triggerToast('⚡ Broker status updated.');
  };

  const handleDeleteAgent = (id: string, name: string) => {
    setAgents(agents.filter(a => a.id !== id));
    triggerToast(`🗑️ Agent "${name}" removed.`);
  };


  // ---------------------------------------------------------------------------
  // 6. REPORTS COMPUTATION ENGINE
  // ---------------------------------------------------------------------------
  const [reportRange, setReportRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isCompilingReport, setIsCompilingReport] = useState(false);
  const [compiledReport, setCompiledReport] = useState<any>({
    date: '2026-06-17',
    summary: 'Nagpur Multi-Platform Conversion Analytics Summary',
    approvedRetentionRate: '94.2%',
    avgEMIComputed: '₹34,800',
    totalEngagementRate: '88%',
    leadSuccessIndex: '3.9x'
  });

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompilingReport(true);
    setTimeout(() => {
      setIsCompilingReport(false);
      setCompiledReport({
        date: new Date().toISOString().split('T')[0],
        summary: `Nagpur Urban Nest Analytics Report (${reportRange === '7d' ? 'Weekly Pulse' : reportRange === '30d' ? 'Monthly Audit' : 'Quarterly Assessment'})`,
        approvedRetentionRate: `${(90 + Math.random() * 8).toFixed(1)}%`,
        avgEMIComputed: `₹${Math.floor(25000 + Math.random() * 15000).toLocaleString()}`,
        totalEngagementRate: `${(80 + Math.random() * 15).toFixed(0)}%`,
        leadSuccessIndex: `${(3 + Math.random() * 2).toFixed(1)}x`
      });
      triggerToast('📊 Dynamic report generated successfully!');
    }, 1000);
  };


  // ---------------------------------------------------------------------------
  // GENERAL UTILITY ACTIONS
  // ---------------------------------------------------------------------------
  const handlePulseRefresh = () => {
    setVisitorsCount(prev => prev + Math.floor(Math.random() * 24) + 10);
    setRoiCalculations(prev => prev + Math.floor(Math.random() * 5));
    setChatBotHits(prev => prev + Math.floor(Math.random() * 10));
    triggerToast('📈 Real-time telemetry data refreshed!');
  };

  const handleSyncSheets = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncCount(prev => prev + leads.length);
      triggerToast('🔄 Multi-channel sheet synchronized.');
    }, 1200);
  };

  const exportMainDataXLSX = () => {
    try {
      const data = leads.map(l => ({
        "Lead ID": l.id,
        "Customer Name": l.name,
        "Email": l.email,
        "Phone": l.phone,
        "Requirement": l.interest,
        "Status": l.status,
        "Enriched Details": l.notes,
        "Registration Date": l.timestamp
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Active_Leads_Report");
      XLSX.writeFile(wb, "Nest_Realty_Admin_Export.xlsx");
      triggerToast('📥 Excel sheet spreadsheet dispatched directly!');
    } catch (err: any) {
      alert("Export failed: " + err.message);
    }
  };

  // ---------------------------------------------------------------------------
  // MAIN FILTERED LISTED DATASETS
  // ---------------------------------------------------------------------------
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const filteredProperties = properties.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchCat = propTypeFilter === 'all' || p.type === propTypeFilter;
    const matchText = p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    return matchCat && matchText;
  });

  const filteredLeads = leads.filter(l => {
    const q = searchQuery.toLowerCase();
    const matchInterest = filterInterest === 'all' || l.interest === filterInterest;
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    const matchText = l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.notes.toLowerCase().includes(q);
    return matchInterest && matchStatus && matchText;
  });

  const filteredAgents = agents.filter(a => {
    const q = searchQuery.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.specialization.toLowerCase().includes(q);
  });

  if (showSheets) {
    return <SheetsView onBackToHome={() => setShowSheets(false)} />;
  }

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] text-[#0E1F35] p-6 py-12 flex flex-col justify-center items-center select-none font-sans relative w-full">
        {/* Back Link to Public Site */}
        <button
          onClick={onBackToHome}
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#B38330] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Portal</span>
        </button>

        {/* Top Header Badge */}
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Black circle Shield with gold borders */}
          <div className="w-16 h-16 rounded-full bg-[#0E1F35] border-2 border-[#B38330]/80 flex items-center justify-center shadow-lg mb-4">
            <Shield className="w-8 h-8 text-[#B38330]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif tracking-widest font-black uppercase text-[#0E1F35]">
            ADMIN PORTAL
          </h1>
          <span className="text-red-650 font-black tracking-widest text-[10px] uppercase mt-1 block">
            AUTHORIZED PERSONNEL ONLY
          </span>
        </div>

        {/* Authentication Options Cards */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center max-w-5xl w-full px-4 mb-12">
          {/* LOG IN CARD */}
          <div className="bg-[#E2E6EC]/70 text-[#0E1F35] flex-1 max-w-[440px] p-8 pb-10 rounded-[2.5rem] border border-[#CBD2D9] shadow-xl relative backdrop-blur-xs flex flex-col justify-between">
            {/* Options Sticker */}
            <div className="absolute top-4 right-4 bg-white/85 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-300 text-slate-500">
              - OPTIONS
            </div>

            <form onSubmit={handleLogInSubmit} className="space-y-5">
              <h2 className="text-3xl font-serif tracking-tight text-[#0E1F35] text-center mb-6 mt-2">
                Log in
              </h2>

              {/* Email field */}
              <div>
                <label className="text-slate-650 font-black tracking-wider text-[9px] mb-2 block uppercase">
                  EMAIL
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={logInEmail}
                    onChange={e => setLogInEmail(e.target.value)}
                    className="w-full bg-white text-slate-850 placeholder:text-gray-400 font-bold text-xs pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300/80 focus:border-[#B38330] focus:ring-1 focus:ring-[#B38330] transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="text-slate-650 font-black tracking-wider text-[9px] mb-2 block uppercase">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showLogInPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={logInPassword}
                    onChange={e => setLogInPassword(e.target.value)}
                    className="w-full bg-white text-slate-850 placeholder:text-gray-400 font-bold text-xs pl-11 pr-12 py-3.5 rounded-2xl border border-slate-300/80 focus:border-[#B38330] focus:ring-1 focus:ring-[#B38330] transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLogInPassword(!showLogInPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-[#B38330] text-slate-400 transition-colors"
                  >
                    {showLogInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Footer Options */}
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 px-1 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#0E1F35] cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => triggerToast('ℹ️ Password recovery dispatched to system administrator email.')}
                  className="hover:text-[#B38330] transition-colors font-semibold"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Core Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#0E1F35] hover:bg-[#B38330] text-white py-3.5 font-bold uppercase tracking-widest text-[11px] rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer mt-5"
              >
                LOG IN
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                -OR-
              </span>

              {/* Google Log In Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full mt-3 bg-[#E2E6EC]/30 hover:bg-white text-slate-800 border-2 border-slate-350/80 py-3.5 rounded-2xl font-black uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>LOG IN WITH GOOGLE</span>
              </button>
            </div>
          </div>

          {/* SIGN UP CARD */}
          <div className="bg-[#E2E6EC]/70 text-[#0E1F35] flex-1 max-w-[440px] p-8 pb-10 rounded-[2.5rem] border border-[#CBD2D9] shadow-xl relative backdrop-blur-xs flex flex-col justify-between">
            {/* Options Sticker */}
            <div className="absolute top-4 right-4 bg-white/85 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-300 text-slate-500">
              - OPTIONS
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <h2 className="text-3xl font-serif tracking-tight text-[#0E1F35] text-center mb-6 mt-2">
                Sign up
              </h2>

              {/* Email field */}
              <div>
                <label className="text-slate-650 font-black tracking-wider text-[9px] mb-1.5 block uppercase">
                  EMAIL
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    className="w-full bg-white text-slate-850 placeholder:text-gray-400 font-bold text-xs pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300/80 focus:border-[#B38330] focus:ring-1 focus:ring-[#B38330] transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="text-slate-650 font-black tracking-wider text-[9px] mb-1.5 block uppercase">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    className="w-full bg-white text-slate-850 placeholder:text-gray-400 font-bold text-xs pl-11 pr-12 py-3.5 rounded-2xl border border-slate-300/80 focus:border-[#B38330] focus:ring-1 focus:ring-[#B38330] transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-[#B38330] text-slate-400 transition-colors"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password field */}
              <div>
                <label className="text-slate-650 font-black tracking-wider text-[9px] mb-1.5 block uppercase">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={signUpConfirmPassword}
                    onChange={e => setSignUpConfirmPassword(e.target.value)}
                    className="w-full bg-white text-slate-850 placeholder:text-gray-400 font-bold text-xs pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300/80 focus:border-[#B38330] focus:ring-1 focus:ring-[#B38330] transition-all outline-none"
                  />
                </div>
              </div>

              {/* Sign Up Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#0E1F35] hover:bg-[#B38330] text-white py-3.5 font-bold uppercase tracking-widest text-[11px] rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer mt-5"
              >
                SIGN UP
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                -OR-
              </span>

              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full mt-3 bg-[#E2E6EC]/30 hover:bg-white text-slate-800 border-2 border-slate-350/80 py-3.5 rounded-2xl font-black uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>SIGN UP WITH GOOGLE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Support Watermark */}
        <div className="text-slate-400 text-[10px] font-bold tracking-wider uppercase font-mono">
          NAGPUR URBAN NEST SECURE HUB SYSTEM
        </div>
      </div>
    );
  }

  const isDark = false;

  return (
    <div 
      id="admin-console-layout" 
      className="min-h-screen font-sans select-none antialiased flex bg-[#FAFBFD] text-slate-800"
    >
      
      {/* Toast Announcement */}
      {toastText && (
        <div className="fixed top-6 right-6 z-50 animate-fadeIn max-w-sm">
          <div className="bg-[#0E1F35] border border-[#B38330]/50 text-white p-3.5 px-5 rounded-2xl shadow-2xl font-bold text-xs tracking-wide">
            {toastText}
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR - Sleek and matching Cummo Side Nav Starter Kit layout with Website Brand Palette */}
      <motion.aside
        id="desktop-sidebar"
        initial={false}
        animate={{ width: isSidebarCollapsed ? '76px' : '280px' }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen sticky top-0 z-40 shrink-0 select-none overflow-y-auto bg-[#0E1F35] border-r border-[#0E1F35] text-slate-200"
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Compass / Cummo Style Icon */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#B38330]/20">
              <Compass className="w-5 h-5 text-[#B38330]" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="text-left"
              >
                <span className="block font-black tracking-tight text-sm uppercase text-white">
                  Welcome admin
                </span>
                <span className="block text-[9px] text-[#B38330]/90 font-black uppercase tracking-widest leading-none">
                  Admin Hub
                </span>
              </motion.div>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg border border-slate-700/60 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Sidebar Middle - All 7 Options requested */}
        <div className="flex-1 p-3 space-y-1">
          {[
            { id: 'users', label: 'Total Users', icon: Users },
            { id: 'properties', label: 'Total Property', icon: Grid },
            { id: 'visitor_analytics', label: 'Visitor Analysis', icon: Activity },
            { id: 'heatmap', label: 'Heat Maps', icon: Flame },
            { id: 'leads', label: 'Leads Management', icon: FileText },
            { id: 'agents', label: 'Agent Management', icon: Briefcase },
            { id: 'reports', label: 'Reports', icon: TrendingUp }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
               <button
                 key={tab.id}
                 onClick={() => {
                   setActiveTab(tab.id as any);
                   setSelectedSessionId(null);
                 }}
                 className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl text-xs uppercase tracking-wider font-extrabold cursor-pointer transition-all ${
                   isSelected
                     ? 'bg-[#B38330] text-[#0E1F35] shadow-md font-black scale-[1.02]'
                     : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                 }`}
                 title={tab.label}
               >
                 <IconComponent className={`w-4.5 h-4.5 shrink-0 transition-all ${
                   isSelected 
                     ? 'text-[#0E1F35]' 
                     : 'text-slate-400'
                 }`} />
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate text-left"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Bottom Area (Logout) */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {/* Logout Button from reference layout */}
          <button
            type="button"
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-extrabold cursor-pointer transition-all border border-[#B38330]/30 bg-white/10 hover:bg-white/20 text-[#B38330]"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Logout Panel</span>}
          </button>
        </div>
      </motion.aside>

      {/* MOBILE HEADER & HAMBURGER */}
      <div className="md:hidden flex items-center justify-between w-full p-4 border-b border-slate-800/10 z-40 fixed top-0 left-0 bg-[#0E1F35] text-white">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#B38330]" />
          <span className="font-extrabold uppercase tracking-wider text-sm text-white">
            Nagpur Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 border border-slate-700/60 text-slate-300 hover:bg-white/10 rounded-xl"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* MOBILE OVERLAY SIDEBAR DRAWER (Fitted for smaller form factors) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-45"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-screen w-[260px] z-50 flex flex-col shadow-2xl bg-[#0E1F35] text-white border-r border-[#0E1F35]"
            >
              <div className="p-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#B38330]" />
                  <div>
                    <span className="block font-black text-xs uppercase text-white font-sans">
                      Welcome admin
                    </span>
                    <span className="block text-[8px] text-[#B38330]/90 tracking-widest font-bold">MOBILE HUB</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-3 space-y-1 overflow-y-auto">
                {[
                  { id: 'users', label: 'Total Users', icon: Users },
                  { id: 'properties', label: 'Total Property', icon: Grid },
                  { id: 'visitor_analytics', label: 'Visitor Analysis', icon: Activity },
                  { id: 'heatmap', label: 'Heat Maps', icon: Flame },
                  { id: 'leads', label: 'Leads Management', icon: FileText },
                  { id: 'agents', label: 'Agent Management', icon: Briefcase },
                  { id: 'reports', label: 'Reports', icon: TrendingUp }
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setSelectedSessionId(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl text-xs uppercase tracking-wider font-extrabold cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#B38330] text-[#0E1F35] shadow-md font-black scale-[1.02]'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <IconComp className={`w-4.5 h-4.5 shrink-0 transition-all ${
                        isSelected 
                          ? 'text-[#0E1F35]' 
                          : 'text-slate-400'
                      }`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 border-t border-white/10 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleAdminLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-450 rounded-xl text-xs uppercase font-extrabold transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Panel</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CORE WORKSPACE CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden pt-[72px] md:pt-0 md:py-6 px-4 sm:px-10">
        <div className="max-w-7xl w-full mx-auto">
          
          {/* Navigation Breadcrumb Controller */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-4 text-left">
              <button
                onClick={handleAdminLogout}
                className="p-3 rounded-full border bg-white text-[#0E1F35] hover:text-[#B38330] hover:bg-slate-50 border-slate-200 transition-colors cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#0E1F35] text-white text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase font-sans">
                    Staff Console
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SQL DB Live proxy
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3.5xl font-black uppercase tracking-tight mt-1.5 font-sans text-[#0E1F35]">
                  Real Estate Console
                </h1>
              </div>
            </div>

            {/* Quick Stats Toolbar */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handlePulseRefresh}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                Pulse Logs
              </button>
              <button
                type="button"
                onClick={handleSyncSheets}
                className="bg-[#0E1F35] hover:bg-[#0E1F35]/90 text-white text-xs font-black uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs border border-transparent"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync ({syncCount})
              </button>
              <button
                type="button"
                onClick={() => setShowSheets(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm border border-emerald-750 font-sans"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Sheets Area
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------------------------------
              TOP KPI OVERVIEW HEADER GRID
              --------------------------------------------------------------------------- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            
            {/* Card 1: Total Visitors */}
            <div className="bg-white border border-slate-200 rounded-2.5xl p-4 sm:p-5 text-left shadow-xs hover:border-[#B38330]/45 transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-450 text-[9px] font-black uppercase tracking-wider block">Total Visitors</span>
                  <span className="text-2xl sm:text-3.5xl font-black text-[#0E1F35] mt-1 block tracking-tight font-mono">
                    {visitorsCount}
                  </span>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-450 border border-slate-100 group-hover:bg-[#B38330]/10 group-hover:text-[#B38330] transition-colors shrink-0">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="w-full h-11 mt-3.5 mb-2 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 240 40" preserveAspectRatio="none">
                  {/* Gentle upward curve with a slight dip before ending upwards */}
                  <path
                    d="M 5 28 C 45 18, 85 18, 125 12 C 165 12, 205 32, 235 8"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Subtle gradient fill below the graph for premium depth */}
                  <path
                    d="M 5 28 C 45 18, 85 18, 125 12 C 165 12, 205 32, 235 8 L 235 40 L 5 40 Z"
                    fill="url(#grad-visitors)"
                    className="opacity-15"
                  />
                  <defs>
                    <linearGradient id="grad-visitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <span className="text-[10px] text-emerald-600 font-extrabold block flex items-center gap-1 font-sans">
                <span className="text-[11px]">▲</span> +12% growth index over 24h
              </span>
            </div>

            {/* Card 2: ROI Calculators Runs */}
            <div className="bg-white border border-slate-200 rounded-2.5xl p-4 sm:p-5 text-left shadow-xs hover:border-[#B38330]/45 transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-450 text-[9px] font-black uppercase tracking-wider block">ROI Calculators Runs</span>
                  <span className="text-2xl sm:text-3.5xl font-black text-[#0E1F35] mt-1 block tracking-tight font-mono">
                    {roiCalculations}
                  </span>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-450 border border-slate-100 group-hover:bg-[#B38330]/10 group-hover:text-[#B38330] transition-colors shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-[#B38330]" />
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="w-full h-11 mt-3.5 mb-2 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 240 40" preserveAspectRatio="none">
                  {/* Dynamic wave pattern */}
                  <path
                    d="M 5 32 C 40 30, 80 10, 120 22 C 160 34, 200 12, 235 15"
                    fill="none"
                    stroke="#B38330"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Subtle gradient fill below the graph */}
                  <path
                    d="M 5 32 C 40 30, 80 10, 120 22 C 160 34, 200 12, 235 15 L 235 40 L 5 40 Z"
                    fill="url(#grad-roi)"
                    className="opacity-15"
                  />
                  <defs>
                    <linearGradient id="grad-roi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B38330" />
                      <stop offset="100%" stopColor="#B38330" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <span className="text-[10px] text-[#B38330] font-extrabold block flex items-center gap-1 font-sans">
                <span className="text-[11px]">▲</span> +8.4% EMIs & rental evaluations
              </span>
            </div>

            {/* Card 3: Bot Chats Conversion */}
            <div className="bg-white border border-slate-200 rounded-2.5xl p-4 sm:p-5 text-left shadow-xs hover:border-[#B38330]/45 transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-450 text-[9px] font-black uppercase tracking-wider block">Bot Chats Conversion</span>
                  <span className="text-2xl sm:text-3.5xl font-black text-[#0E1F35] mt-1 block tracking-tight font-mono">
                    {chatBotHits}
                  </span>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-450 border border-slate-100 group-hover:bg-indigo-100 group-hover:text-[#0E1F35] transition-colors shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#0E1F35]" />
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="w-full h-11 mt-3.5 mb-2 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 240 40" preserveAspectRatio="none">
                  {/* Steep rising trend wave */}
                  <path
                    d="M 5 25 C 45 35, 85 5, 125 18 C 165 30, 205 10, 235 5"
                    fill="none"
                    stroke="#0E1F35"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Subtle gradient fill */}
                  <path
                    d="M 5 25 C 45 35, 85 5, 125 18 C 165 30, 205 10, 235 5 L 235 40 L 5 40 Z"
                    fill="url(#grad-chats)"
                    className="opacity-15"
                  />
                  <defs>
                    <linearGradient id="grad-chats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0E1F35" />
                      <stop offset="100%" stopColor="#0E1F35" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <span className="text-[10px] text-[#0E1F35]/80 font-extrabold block flex items-center gap-1 font-sans">
                <span className="text-[11px]">▲</span> +18.2% Gemini bot automation
              </span>
            </div>

            {/* Card 4: RERA Cookie Status */}
            <div className="bg-white border border-slate-200 rounded-2.5xl p-4 sm:p-5 text-left shadow-xs hover:border-[#B38330]/45 transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-450 text-[9px] font-black uppercase tracking-wider block">RERA Cookie Status</span>
                  <span className="text-2xl sm:text-3.5xl font-black text-emerald-700 mt-1 block tracking-tight font-mono">
                    {getConsent() === 'Accepted' ? '92.4%' : '84.1%'}
                  </span>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-450 border border-slate-100 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="w-full h-11 mt-3.5 mb-2 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 240 40" preserveAspectRatio="none">
                  {/* Stable solid growth graph representing privacy consent rate */}
                  <path
                    d="M 5 15 C 45 10, 85 28, 125 22 C 165 16, 205 5, 235 12"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Subtle gradient fill */}
                  <path
                    d="M 5 15 C 45 10, 85 28, 125 22 C 165 16, 205 5, 235 12 L 235 40 L 5 40 Z"
                    fill="url(#grad-consent)"
                    className="opacity-15"
                  />
                  <defs>
                    <linearGradient id="grad-consent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <span className="text-[10px] text-slate-500 font-extrabold block flex items-center gap-1 font-sans">
                <span className="text-[11px]">●</span> Consented compliance audit
              </span>
            </div>

          </div>

        {/* Search & Inbound queries Filter toolbar */}
        {activeTab !== 'heatmap' && (
          <div className="bg-white border border-slate-200 p-4.5 rounded-3xl shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between text-left">
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder={`Search ${activeTab.toUpperCase().replace('_', ' ')} fields...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-850 placeholder:text-slate-400 focus:outline-none focus:border-[#0E1F35] focus:ring-1 focus:ring-[#0E1F35]"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto shrink-0">
              {activeTab === 'properties' && (
                <div className="flex gap-1.5 items-center">
                  <span className="text-[10px] uppercase font-black text-slate-450 mt-1">Listing Type:</span>
                  <select
                    value={propTypeFilter}
                    onChange={e => setPropTypeFilter(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-black text-[#0E1F35]"
                  >
                    <option value="all">All listings</option>
                    <option value="Buy">Buy Apartment</option>
                    <option value="Rent">Rent Residences</option>
                    <option value="Plots">Nagpur Plots</option>
                    <option value="PG/Co-Living">PG Housing</option>
                  </select>
                </div>
              )}

              {activeTab === 'leads' && (
                <div className="flex gap-2.5">
                  <select
                    value={filterInterest}
                    onChange={e => setFilterInterest(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-extrabold text-[#0E1F35] focus:outline-none"
                  >
                    <option value="all">Category: All</option>
                    <option value="Buy">Buy Apartment</option>
                    <option value="Sell">Listed Sellers</option>
                    <option value="Rent">Rent Seekers</option>
                    <option value="Plot">Plots Category</option>
                    <option value="PG/Co-Living">Student PG</option>
                    <option value="Home Loan">Mortgage Inquiries</option>
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-extrabold text-[#0E1F35] focus:outline-none"
                  >
                    <option value="all">Status: All</option>
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={exportMainDataXLSX}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-[#0E1F35] text-[10px] font-black uppercase tracking-wider py-2 px-3 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export Excel
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------------
            THE ACTIVE TAB DISPLAYS CONTAINER
            --------------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN COLUMN OVERVIEW LEFT & CENTER: TAB DETAILS VIEW (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-8 text-left">
            
            {/* ---------------------------------------------------------
                TAB 1: TOTAL USERS SUITE
                --------------------------------------------------------- */}
            {activeTab === 'users' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-[#0E1F35] flex items-center gap-2 font-sans">
                      <Users className="w-5 h-5 text-[#B38330]" /> Total Users Directory ({filteredUsers.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">Registered system portal buyers, sellers, or landlords accounts.</p>
                  </div>
                </div>

                {/* VISUAL CHARTS & GRAPHS SUITE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-slate-200/60 pb-8">
                  {/* CHART 1: System Role Proportions */}
                  <div className="bg-[#FAFBFD] p-5 rounded-2.5xl border border-slate-200 text-left flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#B38330] tracking-widest mb-1 block font-mono">
                        METRICS UNIT // 01
                      </span>
                      <h4 className="text-xs font-black uppercase text-[#0E1F35] mb-4 font-sans">
                        System Role Distribution
                      </h4>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Donut Container */}
                      <div className="relative w-28 h-28 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          {/* Background Ring */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#E2E8F0"
                            strokeWidth="9"
                          />
                          {/* Segments */}
                          {(() => {
                            const total = filteredUsers.length || 1;
                            let currentAngleOffset = 0;
                            const rolesData = [
                              { role: 'Admin', color: '#0E1F35', count: filteredUsers.filter(u => u.role === 'Admin').length },
                              { role: 'Buyer', color: '#B38330', count: filteredUsers.filter(u => u.role === 'Buyer').length },
                              { role: 'Seller', color: '#10B981', count: filteredUsers.filter(u => u.role === 'Seller').length },
                              { role: 'Landlord', color: '#3B82F6', count: filteredUsers.filter(u => u.role === 'Landlord').length },
                              { role: 'Broker', color: '#F59E0B', count: filteredUsers.filter(u => u.role === 'Broker').length },
                            ].filter(r => r.count > 0);

                            return rolesData.map((r, idx) => {
                              const pct = (r.count / total) * 100;
                              // Circumference with r=38 is 2 * Math.PI * 38 = 238.76
                              const circ = 238.76;
                              const dashArray = `${(pct / 100) * circ} ${circ}`;
                              const dashOffset = -((currentAngleOffset / 100) * circ);
                              currentAngleOffset += pct;

                              const isHovered = hoveredRole === r.role;
                              return (
                                <circle
                                  key={idx}
                                  cx="50"
                                  cy="50"
                                  r="38"
                                  fill="transparent"
                                  stroke={r.color}
                                  strokeWidth={isHovered ? '12' : '9'}
                                  strokeDasharray={dashArray}
                                  strokeDashoffset={dashOffset}
                                  className="transition-all duration-300 cursor-pointer origin-center"
                                  onMouseEnter={() => setHoveredRole(r.role)}
                                  onMouseLeave={() => setHoveredRole(null)}
                                />
                              );
                            });
                          })()}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-base font-mono font-black text-[#0E1F35]">{filteredUsers.length}</span>
                          <span className="text-[7px] text-slate-400 font-extrabold uppercase tracking-widest">Users</span>
                        </div>
                      </div>

                      {/* Legends */}
                      <div className="flex-1 w-full space-y-1.5 text-xs">
                        {[
                          { role: 'Admin', color: 'bg-[#0E1F35]', label: 'Admins' },
                          { role: 'Buyer', color: 'bg-[#B38330]', label: 'Buyers' },
                          { role: 'Seller', color: 'bg-emerald-500', label: 'Sellers' },
                          { role: 'Landlord', color: 'bg-blue-500', label: 'Landlords' },
                          { role: 'Broker', color: 'bg-amber-500', label: 'Brokers' }
                        ].map(legend => {
                          const count = filteredUsers.filter(u => u.role === legend.role).length;
                          const pct = filteredUsers.length ? ((count / filteredUsers.length) * 100).toFixed(0) : '0';
                          const isHovered = hoveredRole === legend.role;
                          return (
                            <div
                              key={legend.role}
                              onMouseEnter={() => setHoveredRole(legend.role)}
                              onMouseLeave={() => setHoveredRole(null)}
                              className={`flex items-center justify-between px-2 py-1 rounded-xl transition-all duration-200 ${
                                isHovered ? 'bg-[#0E1F35]/5 scale-[1.02] border-l-2 border-[#B38330]' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full ${legend.color}`} />
                                <span className="font-extrabold text-[10px] text-slate-700 uppercase tracking-wider">{legend.label}</span>
                              </div>
                              <div className="font-mono font-bold text-[#0E1F35] text-[10px]">
                                {count} <span className="text-slate-400 text-[9px]">({pct}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* CHART 2: Active Attendance Metrics */}
                  <div className="bg-[#FAFBFD] p-5 rounded-2.5xl border border-slate-200 text-left flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#B38330] tracking-widest mb-1 block font-mono">
                        METRICS UNIT // 02
                      </span>
                      <h4 className="text-xs font-black uppercase text-[#0E1F35] mb-3 font-sans">
                        Sessions Activity Pulse (Top Active)
                      </h4>
                    </div>

                    <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                      {filteredUsers.slice(0, 4).map((u, i) => {
                        const maxSessions = Math.max(...filteredUsers.map(x => x.sessions || 10), 1);
                        const progressPct = (((u.sessions || 1) / maxSessions) * 100).toFixed(0);
                        return (
                          <div key={u.id} className="space-y-1">
                            <div className="flex justify-between text-[9px] font-extrabold text-slate-650 uppercase tracking-wider">
                              <span className="truncate max-w-[140px]">{u.name}</span>
                              <span className="font-mono text-[#0E1F35] font-black">{u.sessions || 0} sessions</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="h-full bg-gradient-to-r from-[#0E1F35] to-[#B38330] rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                      {filteredUsers.length === 0 && (
                        <div className="text-center py-6 text-slate-400 text-[10px] font-bold">
                          NO ACTIVE USERS MATCHING FILTERS
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto mt-4 rounded-xl border border-slate-150">
                  <table className="w-full text-left text-xs text-slate-650">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold p-3 text-[10px] uppercase text-slate-450">
                        <th className="p-3">User Token</th>
                        <th className="p-3">Profile Info</th>
                        <th className="p-3">System Role</th>
                        <th className="p-3">Active Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-[#0E1F35] text-[10px]">{user.id}</td>
                          <td className="p-3 text-left">
                            <p className="font-extrabold text-slate-800">{user.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              user.role === 'Admin' ? 'bg-[#0E1F35] text-white' :
                              user.role === 'Broker' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              'bg-slate-100 text-slate-700'
                            }`}>{user.role}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              user.status === 'Active' || user.status === 'Online' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' : 'bg-rose-50 text-rose-700'
                            }`}>{user.status}</span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => toggleUserStatus(user.id)}
                                className="text-[10px] uppercase font-black text-[#B38330] hover:text-[#0E1F35] hover:underline cursor-pointer"
                              >
                                Toggle
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------
                TAB 2: TOTAL PROPERTIES SUITE
                --------------------------------------------------------- */}
            {activeTab === 'properties' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight text-[#0E1F35] flex items-center gap-2 font-serif">
                    <Grid className="w-5 h-5 text-emerald-600" /> Real Estate Listings Center ({filteredProperties.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Curated apartment structures, resales house, plots layout properties verified under Nagpur rules.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProperties.map(prop => (
                    <div key={prop.id} className="border border-slate-200 rounded-2.5xl overflow-hidden hover:shadow-md transition-all flex flex-col bg-white">
                      <div className="h-32 bg-slate-100 relative">
                        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 bg-[#0E1F35] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded">
                          {prop.type}
                        </span>
                        {prop.featured && (
                          <span className="absolute top-2.5 right-2.5 bg-amber-400 text-[#0E1F35] text-[8px] font-black uppercase px-2 py-0.5 rounded">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <div className="p-4 space-y-1 bg-slate-50/50 flex-1 flex flex-col justify-between text-left">
                        <div className="space-y-1">
                          <p className="font-extrabold text-slate-800 text-xs truncate" title={prop.title}>{prop.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold font-mono">📍 {prop.location}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px]">
                          <span className="text-emerald-700 font-black font-mono text-xs">{prop.price}</span>
                          <span className="text-slate-500 font-bold font-sans">{prop.area} ({prop.bhk})</span>
                        </div>
                        
                        <div className="pt-3 mt-2 border-t border-slate-150 flex justify-between items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleTogglePropertyFeature(prop.id)}
                            className="bg-white hover:bg-slate-100 border border-slate-200 p-1 px-2 rounded font-black text-[9px] uppercase tracking-normal"
                          >
                            ★ Feature
                          </button>
                          
                          {prop.status !== 'Approved' ? (
                            <button
                              onClick={() => handleApproveProperty(prop.id)}
                              className="bg-emerald-600 text-white hover:bg-emerald-700 p-1 px-2.5 rounded font-bold text-[9px] uppercase"
                            >
                              Approve Listing
                            </button>
                          ) : (
                            <span className="text-emerald-700 text-[9px] font-black uppercase">✔ Verified Live</span>
                          )}

                          <button
                            onClick={() => handleDeleteProperty(prop.id, prop.title)}
                            className="text-rose-600 hover:text-rose-100 p-1 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------
                TAB 3: VISITOR ANALYTICS SUITE (VTS)
                --------------------------------------------------------- */}
            {activeTab === 'visitor_analytics' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight text-[#0E1F35] flex items-center gap-2 font-sans">
                    <Activity className="w-5 h-5 text-rose-500" /> Visitor Footprints & RERA Telemetry
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Real-time user diagnostic telemetry trackers logging computed EMIs charts, land exploration hits.</p>
                </div>

                {vtsActions.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Activity className="w-8 h-8 text-slate-350 animate-pulse mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-bold">No tracking footprints recorded. Visit pages or compute loans EMI to stream here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 bg-[#0E1F35]/5 p-4 border border-[#0E1F35]/10 rounded-2xl">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase text-[#0E1F35] block">Pulse Rate</span>
                        <span className="text-base font-black text-[#0E1F35] font-mono">1.4ms latency</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold uppercase text-[#0E1F35] block">Accepted Consent</span>
                        <span className="text-base font-black text-emerald-750 font-mono">82% ratio</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold uppercase text-[#0E1F35] block">RERA Audits</span>
                        <span className="text-base font-black text-[#0E1F35] font-mono">OK / Certified</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-150">
                      <table className="w-full text-left font-sans text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] font-bold p-3 text-slate-450">
                            <th className="p-3">Inbound Action Topic</th>
                            <th className="p-3">Visitor / Hash Code</th>
                            <th className="p-3">Exploration Summary</th>
                            <th className="p-3">Timestamp Log</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold font-mono text-[11px]">
                          {vtsActions.slice().reverse().map((a, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="p-3 text-left">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-white ${
                                  a.action === 'Property Viewed' ? 'bg-[#B38330]' :
                                  a.action === 'AI Chat Search' ? 'bg-[#0E1F35]' :
                                  'bg-[#B38330]'
                                }`}>{a.action}</span>
                              </td>
                              <td className="p-3 text-slate-700 text-left font-mono">{a.visitorId}</td>
                              <td className="p-3 text-slate-600 font-sans truncate max-w-xs">{a.details}</td>
                              <td className="p-3 text-slate-450 text-[10px]">
                                {new Date(a.timestamp).toLocaleTimeString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------------
                TAB 4: HEAT MAPS INTEGRATION
                --------------------------------------------------------- */}
            {activeTab === 'heatmap' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs animate-fadeIn">
                <AdminHeatMapHub />
              </div>
            )}

            {/* ---------------------------------------------------------
                TAB 5: LEADS INBOX & FILE SPREADSHEET SYSTEM
                --------------------------------------------------------- */}
            {activeTab === 'leads' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-[#0E1F35] flex items-center gap-2 font-serif">
                      <FolderIcon className="w-5 h-5 text-sky-600" /> Direct Inbound Leads Inbox ({filteredLeads.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-semibold font-sans">Verifiable client requirements synced on Google spreadsheet proxy connection.</p>
                  </div>
                </div>

                {filteredLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-3xl block">📬</span>
                    <p className="text-xs font-bold text-slate-500 mt-3 uppercase tracking-wider">No active leads match the query</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredLeads.map(lead => (
                      <div key={lead.id} className="py-4.5 flex flex-col md:flex-row justify-between items-start gap-4 hover:bg-slate-50/50 p-3 rounded-2xl transition-colors">
                        <div className="space-y-1.5 flex-1 select-text">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[9px] bg-slate-200 px-2 py-0.5 rounded font-black text-slate-650">{lead.id}</span>
                            <h4 className="text-sm font-black text-[#0E1F35]">{lead.name}</h4>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#B38330]/10 text-[#B38330] border border-[#B38330]/20">
                              {lead.interest}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-705 font-semibold text-left font-sans italic leading-relaxed pt-1.5">
                            &ldquo;{lead.notes}&rdquo;
                          </p>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 font-semibold pt-1">
                            <span>📧 {lead.email}</span>
                            <span>📞 {lead.phone}</span>
                            <span>⏰ {lead.timestamp}</span>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end gap-2.5 shrink-0 self-start w-full md:w-auto border-t md:border-t-0 border-slate-150 pt-2.5 md:pt-0">
                          <select
                            value={lead.status}
                            onChange={e => updateLeadStatus(lead.id, e.target.value as any)}
                            className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border cursor-pointer bg-white ${
                              lead.status === 'Verified' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' :
                              lead.status === 'Contacted' ? 'bg-sky-50 border-sky-300 text-sky-700' :
                              'bg-amber-50 border-amber-300 text-amber-700'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Verified">Verified</option>
                          </select>

                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            className="text-rose-600 hover:text-rose-100 p-1.5 rounded transition-colors self-end"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------------
                TAB 6: AGENT DIRECTORIES & CHAT DIALOGS SUITE
                --------------------------------------------------------- */}
            {activeTab === 'agents' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight text-[#0E1F35] flex items-center gap-2 font-serif">
                    <Briefcase className="w-5 h-5 text-teal-650" /> Nagpur Relationship Brokers ({filteredAgents.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Active human relationship brokers assigned to dispatch floats & digital AI chatbot sessions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAgents.map(ag => (
                    <div key={ag.id} className="p-4 rounded-2.5xl border border-slate-200 bg-[#FAFBFD]/60 flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-800 text-sm">{ag.name}</p>
                        <p className="text-xs text-slate-500 font-semibold">{ag.email}</p>
                        <p className="text-[10px] text-teal-700 font-extrabold uppercase mt-1">Specialization: {ag.specialization}</p>
                        <div className="flex gap-2 items-center text-[10px] text-slate-450 mt-1 font-bold">
                          <span>★ {ag.rating} Rating</span>
                          <span>|</span>
                          <span>{ag.activeInquiries} Inquiries</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          ag.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800'
                        }`}>{ag.status}</span>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleAgentStatus(ag.id)}
                            className="bg-white text-[9px] font-bold border border-slate-200 py-1 px-1.5 rounded uppercase hover:bg-slate-50"
                          >
                            Status
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(ag.id, ag.name)}
                            className="text-rose-600 hover:text-rose-100 p-1 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub-Section: WhatsApp Dispatched Inbound widget Logs */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-3">
                    <MessageSquare className="w-4 h-4" /> Floating WhatsApp Widget Click Logs ({whatsappChats.length})
                  </h3>
                  
                  <div className="space-y-3">
                    {whatsappChats.map(wa => (
                      <div key={wa.id} className="p-4 bg-emerald-50/25 border border-emerald-100 rounded-2xl flex justify-between items-center text-xs">
                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded font-bold">{wa.id}</span>
                            <span className="font-extrabold text-[#0E1F35]">{wa.name} ({wa.city})</span>
                            <span className="text-[9px] text-slate-500 font-mono">{wa.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-650 italic font-mono">&ldquo;{wa.message}&rdquo;</p>
                          <p className="text-[10px] text-teal-850 font-bold">Inquiry channeled automatically to: <strong>{wa.agent}</strong></p>
                        </div>
                        <button
                          onClick={() => setWhatsappChats(whatsappChats.filter(x => x.id !== wa.id))}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-Section: Virtual AI Agent prompts recordings */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#0E1F35] flex items-center gap-1.5 mb-3 font-sans">
                    <Bot className="w-4.5 h-4.5 text-[#B38330]" /> Digital virtual AI agent Prompts Recordings ({chatbotSessions.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Conversations list sidebar mapping */}
                    <div className="space-y-2 max-h-[170px] overflow-y-auto">
                      {chatbotSessions.map(bot => {
                        const isSelected = selectedSessionId === bot.id;
                        return (
                          <div
                            key={bot.id}
                            onClick={() => setSelectedSessionId(isSelected ? null : bot.id)}
                            className={`p-3 rounded-xl cursor-pointer border text-left transition-colors ${
                              isSelected ? 'bg-[#0E1F35]/5 border-[#B38330]' : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <p className="text-xs font-extrabold text-[#0E1F35] truncate">{bot.name}</p>
                            <span className="text-[9px] font-bold text-[#B38330] block mt-1 uppercase font-mono">Tone style: {bot.persona}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat inspector detailed view mapping */}
                    <div className="md:col-span-2 bg-[#FAFBFD] p-4.5 rounded-2.5xl border border-slate-150 flex flex-col justify-between text-left min-h-[110px]">
                      {selectedSessionId ? (
                        (() => {
                          const s = chatbotSessions.find(cs => cs.id === selectedSessionId);
                          return (
                            <div className="space-y-2.5">
                              <p className="text-[10px] font-black uppercase text-[#B38330]">Transcript Code {s.id}</p>
                              {s.messages.map((m: any, idx: number) => (
                                <div key={idx} className="space-y-0.5">
                                  <span className="text-[8px] text-slate-450 font-bold block">{m.role === 'user' ? 'Client' : 'AI chatbot'}</span>
                                  <p className={`p-2 rounded-xl text-xs ${m.role === 'user' ? 'bg-[#0E1F35] text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                                    {m.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          );
                        })()
                      ) : (
                        <p className="text-xs text-slate-450 font-bold font-sans italic my-auto text-center w-full">Choose a chatbot transcript prompt to audit dialogs live.</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------------
                TAB 7: REPORT PERFORMANCE SUITE
                --------------------------------------------------------- */}
            {activeTab === 'reports' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight text-[#0E1F35] flex items-center gap-2 font-serif">
                    <TrendingUp className="w-5 h-5 text-amber-600" /> Multi-Channel Performance Reports
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Verify conversion performance, average EMIs calculators runs and export direct workbook packages.</p>
                </div>

                <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left">
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-500 mb-1">Time Assessment Period</label>
                    <select
                      value={reportRange}
                      onChange={e => setReportRange(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold font-sans"
                    >
                      <option value="7d">Past 7 Days</option>
                      <option value="30d">Past 30 Days (Monthly)</option>
                      <option value="90d">Past 90 Days (Quarterly)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-500 mb-1">Data Sourcing Scope</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold font-sans"
                    >
                      <option>All Dynamic Inbounds</option>
                      <option>Cookie footprints only</option>
                      <option>Manual spreadsheet only</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isCompilingReport}
                      className="w-full bg-[#B38330] hover:bg-[#966b24] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {isCompilingReport ? 'Compiling Pulse...' : 'Compile Reports'}
                    </button>
                  </div>
                </form>

                {compiledReport && (
                  <div className="p-5.5 rounded-2.5xl border border-slate-250 bg-[#FAFBFD] space-y-4 text-left font-sans">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                      <h4 className="text-xs font-black text-[#0E1F35] uppercase">{compiledReport.summary}</h4>
                      <span className="text-[10px] font-mono text-slate-450 font-bold">Generated: {compiledReport.date}</span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-150">
                        <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Consent Approved</span>
                        <p className="text-xl font-mono font-black text-[#0E1F35] mt-1">{compiledReport.approvedRetentionRate}</p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-150">
                        <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Median EMIs Run</span>
                        <p className="text-xl font-mono font-black text-emerald-700 mt-1">{compiledReport.avgEMIComputed}</p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-150">
                        <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Conversational Eng.</span>
                        <p className="text-xl font-mono font-black text-[#0E1F35] mt-1">{compiledReport.totalEngagementRate}</p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-150">
                        <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Leads ROI Index</span>
                        <p className="text-xl font-mono font-black text-[#B38330] mt-1">{compiledReport.leadSuccessIndex}</p>
                      </div>
                    </div>

                    {/* DYNAMIC PERFORMANCE TREND WAVE CHART */}
                    {(() => {
                      const getTrendData = () => {
                        if (reportRange === '7d') {
                          return {
                            points: [32, 48, 38, 70, 58, 88, 94],
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            unit: 'Hits'
                          };
                        } else if (reportRange === '30d') {
                          return {
                            points: [120, 185, 240, 310, 412],
                            labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'],
                            unit: 'Users'
                          };
                        } else {
                          return {
                            points: [450, 620, 580, 790, 890, 1080],
                            labels: ['Apr A', 'Apr B', 'May A', 'May B', 'Jun A', 'Jun B'],
                            unit: 'Growth'
                          };
                        }
                      };

                      const trend = getTrendData();
                      const width = 500;
                      const height = 130;
                      const paddingLeft = 35;
                      const paddingRight = 15;
                      const paddingTop = 15;
                      const paddingBottom = 22;

                      const maxVal = Math.max(...trend.points, 1) * 1.15;
                      const L = trend.points.length;

                      const coords = trend.points.map((val, idx) => {
                        const x = paddingLeft + (idx / (L - 1)) * (width - paddingLeft - paddingRight);
                        const y = (height - paddingBottom) - (val / maxVal) * (height - paddingBottom - paddingTop);
                        return { x, y, val, label: trend.labels[idx] };
                      });

                      const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
                      const areaPath = L > 0 ? `${linePath} L ${coords[L - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z` : '';

                      return (
                        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 mt-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] font-mono font-black text-[#B38330] uppercase tracking-wider">Metrics Growth Spectrum Matrix</span>
                            <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold uppercase px-1.5 py-0.5 rounded border border-emerald-200">Dynamic Live Telemetry</span>
                          </div>

                          <div className="relative w-full overflow-hidden">
                            <svg className="w-full h-auto" viewBox={`0 0 ${width} ${height}`}>
                              <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#B38330" stopOpacity="0.25" />
                                  <stop offset="100%" stopColor="#B38330" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>

                              {/* Horizontal Grid lines */}
                              {[0, 0.25, 0.5, 0.75, 1].map((ratio, gridIdx) => {
                                const y = paddingTop + ratio * (height - paddingBottom - paddingTop);
                                const valLabel = (maxVal * (1 - ratio)).toFixed(0);
                                return (
                                  <g key={gridIdx} className="opacity-30">
                                    <line
                                      x1={paddingLeft}
                                      y1={y}
                                      x2={width - paddingRight}
                                      y2={y}
                                      stroke="#CBD5E1"
                                      strokeWidth="0.75"
                                      strokeDasharray="3,3"
                                    />
                                    <text
                                      x={paddingLeft - 6}
                                      y={y + 2.5}
                                      textAnchor="end"
                                      fill="#64748B"
                                      className="text-[7px] font-mono font-black"
                                    >
                                      {valLabel}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Fill Area with Gradient */}
                              <path d={areaPath} fill="url(#areaGrad)" />

                              {/* Core Line Path */}
                              <path d={linePath} fill="none" stroke="#B38330" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

                              {/* X Axis Labels */}
                              {coords.map((c, idx) => (
                                <text
                                  key={idx}
                                  x={c.x}
                                  y={height - 6}
                                  textAnchor="middle"
                                  fill="#64748B"
                                  className="text-[7px] font-bold uppercase tracking-wider font-mono"
                                >
                                  {c.label}
                                </text>
                              ))}

                              {/* Interactive dots with Hover popup */}
                              {coords.map((c, idx) => {
                                const isHovered = hoveredTrendIndex === idx;
                                return (
                                  <g key={idx}>
                                    <circle
                                      cx={c.x}
                                      cy={c.y}
                                      r={isHovered ? '5' : '3'}
                                      fill={isHovered ? '#0E1F35' : '#B38330'}
                                      stroke="white"
                                      strokeWidth="1.2"
                                      className="transition-all duration-200 cursor-pointer"
                                      onMouseEnter={() => setHoveredTrendIndex(idx)}
                                      onMouseLeave={() => setHoveredTrendIndex(null)}
                                    />
                                    {isHovered && (
                                      <g>
                                        <rect
                                          x={c.x < width - 65 ? c.x + 8 : c.x - 73}
                                          y={c.y - 18}
                                          width="65"
                                          height="18"
                                          rx="3"
                                          fill="#0E1F35"
                                          className="shadow-sm"
                                        />
                                        <text
                                          x={c.x < width - 65 ? c.x + 40.5 : c.x - 40.5}
                                          y={c.y - 6}
                                          textAnchor="middle"
                                          fill="white"
                                          className="text-[7px] font-mono font-black"
                                        >
                                          {c.val} {trend.unit}
                                        </text>
                                      </g>
                                    )}
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                        </div>
                      );
                    })()}

                    <p className="text-[11px] text-slate-550 leading-relaxed font-sans font-medium">
                      Calculated using real estate analytics models. Performance records verify that Wardha Road and Shankarpeth lead categories represent 64% of all local portal visits, with a strong preference towards 3 BHK sizes.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN STACK PANEL sidebar widgets (lg:col-span-1) */}
          <div className="lg:col-span-1 space-y-8 select-none">
            
            {/* Sandbox creation panel based on active views context */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-left shadow-xs">
              
              {activeTab === 'users' ? (
                <div className="space-y-4.5">
                  <h3 className="text-xs uppercase font-black text-[#0E1F35] tracking-wider flex items-center gap-1.5 border-b border-rose-50 pb-2.5">
                    <UserCheck className="w-4 h-4 text-[#B38330]" /> Create Sandbox User Account
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    Instantly simulate new portal users to test customized role-based interfaces.
                  </p>
                  
                  <form onSubmit={handleCreateUser} className="space-y-3">
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Full User Name *</label>
                      <input 
                        type="text"
                        required 
                        placeholder="e.g. Anand Satpute"
                        value={newUserName}
                        onChange={e => setNewUserName(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Email Identity *</label>
                      <input 
                        type="email"
                        required 
                        placeholder="e.g. anand@outlook.com"
                        value={newUserEmail}
                        onChange={e => setNewUserEmail(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-xs font-mono font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Assigned Role</label>
                      <select 
                        value={newUserRole}
                        onChange={e => setNewUserRole(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-xs font-bold text-slate-800"
                      >
                        <option value="Buyer">Buyer Participant</option>
                        <option value="Seller">Seller Listing</option>
                        <option value="Landlord">Landlord Operator</option>
                        <option value="Broker">Broker Representative</option>
                        <option value="Admin">Administrator Manager</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#0E1F35] hover:bg-[#163359] text-white py-2.5 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Inbound Sandbox User
                    </button>
                  </form>
                </div>
              ) : activeTab === 'properties' ? (
                <div className="space-y-4.5">
                  <h3 className="text-xs uppercase font-black text-[#0E1F35] tracking-wider flex items-center gap-1.5 border-b border-rose-50 pb-2.5">
                    <PlusCircle className="w-4 h-4 text-emerald-600" /> Create Listing Sandbox
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    Test live listings rendering configurations under various categories in direct client homepages.
                  </p>

                  <form onSubmit={handleCreateProperty} className="space-y-3">
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Property Headline Title *</label>
                      <input 
                        type="text"
                        required 
                        placeholder="e.g. Heritage 2 BHK Villa"
                        value={newPropTitle}
                        onChange={e => setNewPropTitle(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Region Location *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Wardha Road, Nagpur"
                        value={newPropLoc}
                        onChange={e => setNewPropLoc(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Category</label>
                        <select 
                          value={newPropType}
                          onChange={e => setNewPropType(e.target.value as any)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-[11px] font-bold text-slate-800"
                        >
                          <option value="Buy">Buy Resale</option>
                          <option value="Rent">Rent Seek</option>
                          <option value="Plots">Nagpur Plots</option>
                          <option value="PG/Co-Living">Students PG</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Price *</label>
                        <input 
                          type="text"
                          required 
                          placeholder="e.g. ₹45 Lakhs"
                          value={newPropPrice}
                          onChange={e => setNewPropPrice(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-[11px] font-bold text-slate-800"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#0E1F35] hover:bg-[#B38330] text-white py-2.5 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                    >
                      Inbound Listing Sandbox
                    </button>
                  </form>
                </div>
              ) : activeTab === 'agents' ? (
                <div className="space-y-4.5">
                  <h3 className="text-xs uppercase font-black text-[#0E1F35] tracking-wider flex items-center gap-1.5 border-b border-rose-50 pb-2.5">
                    <UserCheck className="w-4 h-4 text-[#B38330]" /> Approve Broker Agent
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    Approve relationship brokers into active WhatsApp floating widget rotations.
                  </p>

                  <form onSubmit={handleCreateAgent} className="space-y-3">
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Broker Name *</label>
                      <input 
                        type="text"
                        required 
                        placeholder="e.g. Pranay Raut"
                        value={newAgentName}
                        onChange={e => setNewAgentName(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Staff Corporate Email *</label>
                      <input 
                        type="email"
                        required 
                        placeholder="e.g. pranay@urban-nest.com"
                        value={newAgentEmail}
                        onChange={e => setNewAgentEmail(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-xs font-mono font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Specialization Focus</label>
                      <select 
                        value={newAgentSpec}
                        onChange={e => setNewAgentSpec(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-xs font-bold text-slate-800"
                      >
                        <option value="Premium Apartments">Resale Apartments</option>
                        <option value="PG & Co-Living">Girls / Boys Student PG housing</option>
                        <option value="Plots & Resales">Nagpur Wardha Road Layouts</option>
                        <option value="Home Loans & Legal">Mortgage Calculations Guidance</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#0E1F35] hover:bg-[#B38330] text-white py-2.5 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                    >
                      Authorize Broker live
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-4.5">
                  <h3 className="text-xs uppercase font-black text-[#0E1F35] tracking-wider flex items-center gap-1.5 border-b border-rose-50 pb-2.5">
                    <PlusCircle className="w-4 h-4 text-sky-600" /> Create Manual Lead Test
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    Manually generate lead credentials to test SMTP alerts and triggers.
                  </p>

                  <form onSubmit={handleCreateLead} className="space-y-3">
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Customer Identifier *</label>
                      <input 
                        required 
                        placeholder="e.g. Rajesh Ghadge"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-black text-[#B38330] block mb-1 mb-1">Email Coordinates *</label>
                      <input 
                        type="email"
                        required 
                        placeholder="e.g. rajesh@gmail.com"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-xs font-mono font-bold text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Contact No.</label>
                        <input 
                          placeholder="+91 9422X"
                          value={newPhone}
                          onChange={e => setNewPhone(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-[11px] font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-450 block mb-1">Requirement</label>
                        <select 
                          value={newInterest}
                          onChange={e => setNewInterest(e.target.value as any)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full text-[10px] font-bold text-slate-800"
                        >
                          <option value="Buy">Buy Apartment</option>
                          <option value="Sell">Sell Listing</option>
                          <option value="Rent">Rent Seek</option>
                          <option value="Plot">Nagpur Plot</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#B38330] hover:bg-[#966b24] text-white py-2.5 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Inbound Lead manually
                    </button>
                  </form>
                </div>
              )}

            </div>


            {/* Excel / XLSX tabular spreadsheet uploader component */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5.5 text-left shadow-xs space-y-4">
              <h3 className="text-xs uppercase font-black text-slate-700 tracking-wider flex items-center gap-1.5 border-b border-rose-50 pb-2.5">
                <Upload className="w-4 h-4 text-[#B38330]" /> Spreadsheet File Ingestion
              </h3>
              
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                Import CSV listings or client sheets directly to dynamically enrich active Nagpur database structures.
              </p>

              {uploadSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-250 p-2.5 rounded-xl text-[10px] text-emerald-800 font-bold">
                  {uploadSuccessMsg}
                </div>
              )}

              {!file ? (
                <div 
                  onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
                  onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                  onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files) processFile(e.dataTransfer.files[0]); }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${
                    dragActive ? 'border-[#B38330] bg-[#B38330]/5' : 'border-slate-200 hover:border-slate-350'
                  }`}
                >
                  <label htmlFor="file-csv-up" className="cursor-pointer">
                    <span className="text-2xl block mb-1">📄</span>
                    <span className="text-[10px] uppercase font-black text-slate-500 block hover:underline">Drag or Upload XLS / CSV</span>
                    <input 
                      type="file" 
                      id="file-csv-up" 
                      accept=".csv, .xlsx, .xls"
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button onClick={() => setFile(null)} className="text-rose-600 font-black">Cancel</button>
                  </div>
                  
                  <div className="space-y-2 text-[10px] font-bold text-slate-500">
                    <label className="block mb-0.5">Ingest Destination Target:</label>
                    <select 
                      value={destTarget}
                      onChange={e => setDestTarget(e.target.value as any)}
                      className="bg-white border rounded p-1 w-full"
                    >
                      <option value="leads_db">Main Leads Inbox Database</option>
                      <option value="sheets_tab">Sheets Workspace Separate Tab</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCommitDataset}
                    className="w-full bg-[#0E1F35] hover:bg-[#1c3e66] text-white py-1.5 rounded text-[10px] uppercase font-black"
                  >
                    Load & Commit File
                  </button>
                </div>
              )}
            </div>

            {/* Simulated Live Database SQL Streams */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-left">
              <div className="flex items-center gap-1.5 mb-2.5 border-b border-rose-50 pb-2">
                <Database className="w-4.5 h-4.5 text-[#0E1F35]" />
                <h3 className="text-xs font-black uppercase text-[#0E1F35] tracking-wider">
                  PostgreSQL Real-time Streams
                </h3>
              </div>
              <div className="bg-slate-900 leading-normal p-3 rounded-2xl border border-slate-850 font-mono text-[9px] text-slate-400 space-y-2 h-34 overflow-y-auto">
                <p className="text-slate-500">[08:14:12] SYSTEM INIT OK... SSL secured</p>
                <p className="text-[#B38330] font-black">[08:14:15] DB_SYNC: Connected to sheet Google 1_vAIsOk proxy</p>
                <p className="text-indigo-400">[08:15:03] GEMINI_API: Dynamic model loaded instructions (Temp 0.15)</p>
                <p className="text-emerald-400">[08:18:50] SYNC_HEALTH: Telemetries live on port 3000</p>
                <p className="text-slate-500">[08:24:12] HEARTBEAT: Standard ping index (14ms latency)</p>
              </div>
            </div>

          </div>

        </div>

        {/* Dynamic regulatory notes */}
        <div className="bg-slate-100 border border-slate-200 rounded-3xl p-5 mt-8 text-left">
          <h3 className="text-xs font-black uppercase text-[#B38330] tracking-wider mb-2">💡 Administrative Nagpur Console Guideline Guidelines</h3>
          <ul className="text-xs text-slate-500 font-semibold space-y-2 list-disc pl-4.5">
            <li><strong>Total Users Account</strong> logs represent active portal participants categorized under various roles and are subject to dynamic simulated controls.</li>
            <li><strong>Visitor Analytics</strong> logs footprints, consenting cookie preferences, average computed financial values, and geographical maps search triggers.</li>
            <li><strong>Leads Management</strong> incorporates SMTP tests with direct mappers loaded for complex raw XLSX / XLS spreadsheet ingestion.</li>
          </ul>
        </div>

      </div>

    </div>

  </div>
  );
}

// -------------------------------------------------------------
// MINOR COMPACT HELPER COMPONENTS
// -------------------------------------------------------------
function FolderIcon(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}
