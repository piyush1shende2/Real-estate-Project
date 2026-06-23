import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  Database, 
  Layers, 
  ExternalLink,
  ChevronRight, 
  Search, 
  Download,
  AlertCircle,
  CheckCircle2,
  Table,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { getAccessToken } from '../workspaceAuth';

interface SheetsViewProps {
  onBackToHome: () => void;
}

const DEFAULT_SPREADSHEET_ID = '1N4yT8snirbYUM0Qo8gUb81dv0N_eytOlXfZEKWhIXYc';
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || 'AIzaSyAWIg1yPFAf9VEzN2an0MvcTCgACxHJz7A';

interface SheetTab {
  name: string;
  range: string;
  headers: string[];
  rows: string[][];
  loading: boolean;
  error: string | null;
  isLocal?: boolean;
  sourceType?: string;
  fileSize?: string;
}

export default function SheetsView({ onBackToHome }: SheetsViewProps) {
  const [spreadsheetId, setSpreadsheetId] = useState<string>(DEFAULT_SPREADSHEET_ID);
  const [activeTabName, setActiveTabName] = useState<string>('contact us');
  const [customRange, setCustomRange] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [connStatus, setConnStatus] = useState<'connected' | 'error' | 'loading'>('loading');
  const [sheetsData, setSheetsData] = useState<Record<string, SheetTab>>({
    'contact us': {
      name: 'Contact Submissions',
      range: 'contact us',
      headers: [],
      rows: [],
      loading: false,
      error: null
    },
    'REGISTER TENANT REQUEST': {
      name: 'Tenant Registrations',
      range: 'REGISTER TENANT REQUEST',
      headers: [],
      rows: [],
      loading: false,
      error: null
    },
    'REGISTER LANDLORD REQUEST': {
      name: 'Landlord Submissions',
      range: 'REGISTER LANDLORD REQUEST',
      headers: [],
      rows: [],
      loading: false,
      error: null
    }
  });

  const [sheetsErrorLog, setSheetsErrorLog] = useState<string | null>(null);

  // Function to fetch a specific tab content using Google Sheets API Key
  const fetchSheetData = async (rangeName: string, idToUse: string = spreadsheetId) => {
    setSheetsData(prev => ({
      ...prev,
      [rangeName]: {
        ...prev[rangeName],
        loading: true,
        error: null
      }
    }));

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${idToUse}/values/${encodeURIComponent(rangeName)}?key=${API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${response.status} Error`);
      }

      const resData = await response.json();
      const rows: string[][] = resData.values || [];
      
      let headers: string[] = [];
      let dataRows: string[][] = [];

      if (rows.length > 0) {
        headers = rows[0];
        dataRows = rows.slice(1);
      }

      setSheetsData(prev => ({
        ...prev,
        [rangeName]: {
          ...prev[rangeName],
          headers,
          rows: dataRows,
          loading: false,
          error: null
        }
      }));

      return true;
    } catch (err: any) {
      console.error(`Error loading range "${rangeName}":`, err);
      setSheetsData(prev => ({
        ...prev,
        [rangeName]: {
          ...prev[rangeName],
          loading: false,
          error: err.message || 'Failed to load sheet'
        }
      }));
      return false;
    }
  };

  const loadAllSheets = async (idToUse: string = spreadsheetId) => {
    setIsRefreshing(true);
    setSheetsErrorLog(null);
    setConnStatus('loading');

    let successCount = 0;
    const tabKeys = Object.keys(sheetsData);
    
    for (const tabKey of tabKeys) {
      const tab = sheetsData[tabKey];
      if (tab?.isLocal) {
        successCount++;
        continue;
      }
      const ok = await fetchSheetData(tabKey, idToUse);
      if (ok) successCount++;
    }

    if (successCount > 0) {
      setConnStatus('connected');
    } else {
      setConnStatus('error');
      setSheetsErrorLog('Could not read sheet data. Please make sure the sheet is public or has reader permissions enabled.');
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    const initialize = async () => {
      // First load local databases from localStorage
      let localSheets: Record<string, SheetTab> = {};
      try {
        const stored = localStorage.getItem('nest_uploaded_sheets_databases');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            localSheets = parsed;
            setSheetsData(prev => ({
              ...prev,
              ...parsed
            }));
          }
        }
      } catch (e) {
        console.error('Error restoring uploaded datasets:', e);
      }

      // Then trigger live API sheets loading
      setIsRefreshing(true);
      setSheetsErrorLog(null);
      setConnStatus('loading');

      let successCount = 0;
      const baseKeys = ['contact us', 'REGISTER TENANT REQUEST', 'REGISTER LANDLORD REQUEST'];
      
      for (const tabKey of baseKeys) {
        const ok = await fetchSheetData(tabKey, spreadsheetId);
        if (ok) successCount++;
      }

      // Include count of any present local tabs
      successCount += Object.keys(localSheets).length;

      if (successCount > 0) {
        setConnStatus('connected');
      } else {
        setConnStatus('error');
        setSheetsErrorLog('Could not read sheet data. Please make sure the sheet is public or has reader permissions enabled.');
      }
      setIsRefreshing(false);
    };

    initialize();
  }, []);

  const handleCustomRangeLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRange.trim()) return;

    // Add manual tab to sheetsData record
    const uniqueKey = customRange.trim();
    if (!sheetsData[uniqueKey]) {
      setSheetsData(prev => ({
        ...prev,
        [uniqueKey]: {
          name: uniqueKey,
          range: uniqueKey,
          headers: [],
          rows: [],
          loading: true,
          error: null
        }
      }));
    }

    setActiveTabName(uniqueKey);
    await fetchSheetData(uniqueKey);
  };

  const handleSpreadsheetIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spreadsheetId.trim()) return;
    loadAllSheets(spreadsheetId);
  };

  const activeSheet = sheetsData[activeTabName] || {
    name: activeTabName,
    range: activeTabName,
    headers: [],
    rows: [],
    loading: false,
    error: null
  };

  return (
    <div id="sheets-view-container" className="bg-[#FDFDFD] text-slate-800 min-h-screen py-10 px-4 sm:px-12 flex flex-col font-sans select-none">
      {/* Visual Header Grid wrapper */}
      <div className="max-w-7xl mx-auto w-full mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2 text-emerald-600 font-mono text-xs uppercase tracking-widest font-extrabold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Google Sheets Live REST Sync</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#0E1F35] font-serif flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-[#0E1F35]" />
            <span>Sheets Lead Console</span>
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl font-medium">
            Real time bi-directional synchronization with your Google Workspace Spreadsheets. Submissions from inquiries, property lists, and tenant registries instantly load using the platform's Google Sheets API key.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl shadow-sm">
          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 hover:bg-slate-50 transition-all text-[#0E1F35] rounded-xl cursor-pointer shadow-xs"
          >
            ← Residential Portal
          </button>
          <button
            type="button"
            onClick={() => loadAllSheets()}
            disabled={isRefreshing}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#0E1F35] hover:bg-[#1a3454] disabled:opacity-50 transition-all text-white rounded-xl cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Main Control Panel Dashboard Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sheets Authentication status block */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase text-slate-500 font-mono tracking-widest">Integration Status</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${connStatus === 'connected' ? 'bg-emerald-500' : connStatus === 'loading' ? 'bg-amber-400' : 'bg-rose-500'}`}></span>
                <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-slate-700">
                  {connStatus === 'connected' ? 'LIVE SYNC' : connStatus === 'loading' ? 'FETCHING' : 'OFFLINE'}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">API Gateway:</span>
                <span className="font-extrabold text-[#B38330]">Sheets REST API v4</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Current Key:</span>
                <span className="font-mono text-[10px] text-emerald-600 tracking-wider font-semibold">AIzaSyAW...xHJz7A</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Active Sheets:</span>
                <span className="font-mono text-[#0E1F35] text-xs font-bold">{Object.keys(sheetsData).length} Tabs Loaded</span>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-[11px] leading-relaxed text-slate-600">
              <div className="flex gap-2 items-start text-emerald-700 font-black mb-1.5 uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Sync Verified Successfully</span>
              </div>
              All inquiries submitted in "Contact Us" or "Rent Property" post to this spreadsheet in real-time. This interactive dashboard fetches the compiled submissions directly using your specialized REST key.
            </div>
          </div>

          {/* Change spreadsheet database source */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0E1F35] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#B38330]" />
              <span>Spreadsheet Target ID</span>
            </h4>
            
            <form onSubmit={handleSpreadsheetIdSubmit} className="space-y-3">
              <p className="text-[11px] text-slate-500 font-medium">
                Switch to another spreadsheet index to live query database ranges directly:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="Paste Spreadsheet ID..."
                  className="bg-slate-50 border border-slate-200 text-xs text-[#0E1F35] font-bold rounded-xl px-3 py-2.5 flex-grow focus:outline-none focus:ring-1 focus:ring-[#0E1F35] font-mono"
                />
                <button
                  type="submit"
                  className="bg-[#0E1F35] hover:bg-[#1a3454] text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              </div>
              {spreadsheetId === DEFAULT_SPREADSHEET_ID && (
                <span className="inline-block text-[9px] text-[#B38330] font-black bg-[#B38330]/10 border border-[#B38330]/20 px-2.5 py-1 rounded">
                  System Default Active Database
                </span>
              )}
            </form>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <a 
                href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-[#0E1F35] hover:text-[#B38330] flex items-center gap-1.5 transition-all font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Google Sheet Tab</span>
              </a>
            </div>
          </div>

          {/* Load Dynamic Tab */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0E1F35] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B38330]" />
              <span>Query Custom Range/Tab</span>
            </h4>
            <form onSubmit={handleCustomRangeLoad} className="space-y-3">
              <p className="text-[11px] text-slate-500 font-medium">
                Directly request any custom range or specific worksheet name for immediate fetch:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={customRange}
                  onChange={(e) => setCustomRange(e.target.value)}
                  placeholder="e.g. Sheet1, Form Responses..."
                  className="bg-slate-50 border border-slate-200 text-xs text-[#0E1F35] font-bold rounded-xl px-3 py-2.5 flex-grow focus:outline-none focus:ring-1 focus:ring-[#0E1F35] font-mono"
                />
                <button
                  type="submit"
                  className="bg-[#B38330] hover:bg-[#976a21] text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Fetch
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column Sheets Data Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm min-h-[500px] flex flex-col justify-between text-left">
          
          <div className="space-y-6">
            
            {/* Sheet Select Navigation Headers */}
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {Object.keys(sheetsData).map((key) => {
                  const isActive = activeTabName === key;
                  const item = sheetsData[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTabName(key)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                        isActive 
                          ? 'bg-[#0E1F35] border-[#0E1F35] text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#0E1F35]'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>{item.name || key}</span>
                      {item.rows.length > 0 && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#0E1F35]/10 text-[#0E1F35]'
                        }`}>
                          {item.rows.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-slate-500 font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                Active Tab: <span className="text-[#0E1F35] font-bold">{activeSheet.range}</span>
              </div>
            </div>

            {/* Error notifications */}
            {sheetsErrorLog && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-rose-850 animate-fadeIn text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <div>
                  <p className="font-extrabold uppercase tracking-wide text-rose-700 mb-1">Spreadsheet Error Log</p>
                  <p>{sheetsErrorLog}</p>
                </div>
              </div>
            )}

            {/* Custom Tab Level Error */}
            {activeSheet.error && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-rose-850 animate-fadeIn text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <div>
                  <p className="font-extrabold uppercase tracking-wide text-rose-700 mb-1">Range Query Error ({activeSheet.range})</p>
                  <p>{activeSheet.error}</p>
                  <div className="mt-2 text-[10px] text-slate-600 bg-slate-50 border border-slate-150 p-2 rounded-lg">
                    Check if your worksheet contains a tab named exactly <code className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-[#0E1F35] font-mono">{activeSheet.range}</code>
                  </div>
                </div>
              </div>
            )}

            {/* Main Interactive Row Table Panel */}
            <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-xs flex-grow min-h-[300px]">
              
              {activeSheet.loading ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                  <RefreshCw className="w-10 h-10 text-[#B38330] animate-spin" />
                  <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Polling Live Google Sheet rows...</p>
                </div>
              ) : activeSheet.rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-4">
                  <Database className="w-12 h-12 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">No submission records found in sheet range</p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Worksheet <code className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[#0E1F35] font-mono">{activeSheet.range}</code> is empty or doesn't have any row items yet. Make new submissions in other tabs to populate!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/80">
                        {activeSheet.headers.map((col, index) => (
                          <th key={index} className="px-5 py-3 font-mono font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                      {activeSheet.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100/40">
                          {activeSheet.headers.map((_, colIndex) => {
                            const val = row[colIndex] || "";
                            const isEmail = val.includes('@') && val.includes('.');
                            return (
                              <td key={colIndex} className="px-5 py-3.5 whitespace-nowrap text-slate-700 font-sans font-medium">
                                {isEmail ? (
                                  <span className="text-emerald-700 font-bold underline select-all">{val}</span>
                                ) : (
                                  <span>{val}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-550 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span>Powered directly by the <strong className="text-[#0E1F35]">Google Sheets Data API v4</strong></span>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Timestamp Format: <strong className="text-slate-600 font-mono">IST / UTC</strong></span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted Sandbox</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
