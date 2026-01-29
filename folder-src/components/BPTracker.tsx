/**
 * Smart BP Tracker Component
 * Manual BP entry, visual trend graphs, automatic alerts, and analysis reports
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Activity,
  Calendar,
  BarChart3,
  FileText,
  X,
  Download,
  FileDown,
  Share2,
  Printer,
  Target,
  Info,
  MessageCircle,
  Award,
  Lightbulb
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  saveBPReading,
  getAllBPReadings,
  getBPReadingsForPeriod,
  calculateBPStats,
  getBPCategory,
  detectBPAlerts,
  deleteBPReading,
  BPReading,
  BPAlert,
  BPStats,
} from '@/services/bpService';
import { format, parseISO, subDays, subWeeks, subMonths } from 'date-fns';
import { BPChatBot } from './BPChatBot';

export const BPTracker: React.FC = () => {
  const [readings, setReadings] = useState<BPReading[]>([]);
  const [systolic, setSystolic] = useState<string>('');
  const [diastolic, setDiastolic] = useState<string>('');
  const [pulse, setPulse] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [alerts, setAlerts] = useState<BPAlert[]>([]);
  const [stats, setStats] = useState<BPStats | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [bpGoal, setBPGoal] = useState<{ systolic: number; diastolic: number } | null>(null);

  useEffect(() => {
    loadReadings();
    // Load BP goal from localStorage
    const savedGoal = localStorage.getItem('bp_goal');
    if (savedGoal) {
      try {
        setBPGoal(JSON.parse(savedGoal));
      } catch (e) {
        console.error('Error loading BP goal:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (readings.length > 0) {
      const periodReadings = getBPReadingsForPeriod(selectedPeriod);
      const periodStats = calculateBPStats(periodReadings);
      setStats(periodStats);
      const detectedAlerts = detectBPAlerts(readings);
      setAlerts(detectedAlerts);
    } else {
      setStats(null);
      setAlerts([]);
    }
  }, [readings, selectedPeriod]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showExportMenu && !target.closest('.export-menu-container')) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExportMenu]);

  const loadReadings = () => {
    const allReadings = getAllBPReadings();
    setReadings(allReadings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);
    const pulseNum = pulse ? parseInt(pulse) : undefined;

    if (!systolicNum || !diastolicNum) {
      alert('Please enter both systolic and diastolic values');
      return;
    }

    if (systolicNum < 50 || systolicNum > 250 || diastolicNum < 30 || diastolicNum > 150) {
      alert('Please enter valid BP values (Systolic: 50-250, Diastolic: 30-150)');
      return;
    }

    try {
      const newReading = saveBPReading({
        systolic: systolicNum,
        diastolic: diastolicNum,
        pulse: pulseNum,
        timestamp: new Date().toISOString(),
        notes: notes.trim() || undefined,
      });

      setReadings([newReading, ...readings]);
      setSystolic('');
      setDiastolic('');
      setPulse('');
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error('Error saving BP reading:', error);
      alert('Failed to save BP reading');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reading?')) {
      if (deleteBPReading(id)) {
        setReadings(readings.filter(r => r.id !== id));
      }
    }
  };

  // Export functions
  const exportToJSON = () => {
    const dataStr = JSON.stringify(readings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bp-readings-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Systolic (mmHg)', 'Diastolic (mmHg)', 'Pulse (bpm)', 'Category', 'Notes'];
    const rows = readings.map(reading => {
      const date = parseISO(reading.timestamp);
      const category = getBPCategory(reading.systolic, reading.diastolic);
      return [
        format(date, 'yyyy-MM-dd'),
        format(date, 'HH:mm'),
        reading.systolic.toString(),
        reading.diastolic.toString(),
        reading.pulse?.toString() || '',
        category.category,
        reading.notes || ''
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bp-readings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.text('Blood Pressure Report', 14, 20);
      
      // Date range
      doc.setFontSize(12);
      const dateRange = readings.length > 0
        ? `${format(parseISO(readings[readings.length - 1].timestamp), 'MMM dd, yyyy')} - ${format(parseISO(readings[0].timestamp), 'MMM dd, yyyy')}`
        : 'No readings';
      doc.text(`Period: ${dateRange}`, 14, 30);
      
      // Summary stats
      if (stats && stats.readingCount > 0) {
        doc.setFontSize(11);
        doc.text(`Total Readings: ${stats.readingCount}`, 14, 40);
        doc.text(`Average BP: ${stats.averageSystolic}/${stats.averageDiastolic} mmHg`, 14, 46);
        doc.text(`Range: Systolic ${stats.minSystolic}-${stats.maxSystolic} | Diastolic ${stats.minDiastolic}-${stats.maxDiastolic}`, 14, 52);
      }
      
      // Table data
      const tableData = readings.map(reading => {
        const date = parseISO(reading.timestamp);
        const category = getBPCategory(reading.systolic, reading.diastolic);
        return [
          format(date, 'MMM dd, yyyy'),
          format(date, 'HH:mm'),
          reading.systolic.toString(),
          reading.diastolic.toString(),
          reading.pulse?.toString() || 'N/A',
          category.category,
          reading.notes || ''
        ];
      });
      
      autoTable(doc, {
        head: [['Date', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Category', 'Notes']],
        body: tableData,
        startY: readings.length > 0 && stats ? 58 : 40,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [239, 68, 68] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
      
      doc.save(`bp-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try CSV or JSON export instead.');
    }
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const dateRange = readings.length > 0
      ? `${format(parseISO(readings[readings.length - 1].timestamp), 'MMM dd, yyyy')} - ${format(parseISO(readings[0].timestamp), 'MMM dd, yyyy')}`
      : 'No readings';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>BP Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #dc2626; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #dc2626; color: white; }
            tr:nth-child(even) { background-color: #f5f5f5; }
            .summary { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #dc2626; }
          </style>
        </head>
        <body>
          <h1>Blood Pressure Report</h1>
          <div class="summary">
            <p><strong>Period:</strong> ${dateRange}</p>
            ${stats && stats.readingCount > 0 ? `
              <p><strong>Total Readings:</strong> ${stats.readingCount}</p>
              <p><strong>Average BP:</strong> ${stats.averageSystolic}/${stats.averageDiastolic} mmHg</p>
              <p><strong>Range:</strong> Systolic ${stats.minSystolic}-${stats.maxSystolic} | Diastolic ${stats.minDiastolic}-${stats.maxDiastolic}</p>
            ` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Systolic</th>
                <th>Diastolic</th>
                <th>Pulse</th>
                <th>Category</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${readings.map(reading => {
                const date = parseISO(reading.timestamp);
                const category = getBPCategory(reading.systolic, reading.diastolic);
                return `
                  <tr>
                    <td>${format(date, 'MMM dd, yyyy')}</td>
                    <td>${format(date, 'HH:mm')}</td>
                    <td>${reading.systolic}</td>
                    <td>${reading.diastolic}</td>
                    <td>${reading.pulse || 'N/A'}</td>
                    <td>${category.category}</td>
                    <td>${reading.notes || ''}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    setShowExportMenu(false);
  };

  const prepareChartData = () => {
    const periodReadings = getBPReadingsForPeriod(selectedPeriod);
    
    // For daily view, show individual readings by time
    if (selectedPeriod === 'daily') {
      return periodReadings
        .map(reading => {
          const date = parseISO(reading.timestamp);
          return {
            date: format(date, 'HH:mm'),
            fullDate: reading.timestamp,
            systolic: reading.systolic,
            diastolic: reading.diastolic,
            readings: 1,
          };
        })
        .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
    }
    
    // For weekly/monthly, group by date for aggregation
    const groupedByDate: Record<string, BPReading[]> = {};
    
    periodReadings.forEach(reading => {
      const dateKey = reading.date;
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(reading);
    });

    // Calculate averages per day
    return Object.entries(groupedByDate)
      .map(([date, dayReadings]) => {
        const avgSystolic = Math.round(
          dayReadings.reduce((sum, r) => sum + r.systolic, 0) / dayReadings.length
        );
        const avgDiastolic = Math.round(
          dayReadings.reduce((sum, r) => sum + r.diastolic, 0) / dayReadings.length
        );
        
        return {
          date: format(parseISO(date), 'MMM dd'),
          fullDate: date,
          systolic: avgSystolic,
          diastolic: avgDiastolic,
          readings: dayReadings.length,
        };
      })
      .sort((a, b) => a.fullDate.localeCompare(b.fullDate));
  };

  const getAnalysisReport = () => {
    if (!stats || readings.length === 0) {
      return null;
    }

    const periodReadings = getBPReadingsForPeriod(selectedPeriod);
    const recentCategory = stats.lastReading 
      ? getBPCategory(stats.lastReading.systolic, stats.lastReading.diastolic)
      : null;

    const trends = {
      systolicTrend: stats.lastReading && periodReadings.length > 1
        ? stats.lastReading.systolic - periodReadings[periodReadings.length - 1].systolic
        : 0,
      diastolicTrend: stats.lastReading && periodReadings.length > 1
        ? stats.lastReading.diastolic - periodReadings[periodReadings.length - 1].diastolic
        : 0,
    };

    return {
      period: selectedPeriod,
      totalReadings: periodReadings.length,
      averageBP: `${stats.averageSystolic}/${stats.averageDiastolic} mmHg`,
      range: `Systolic: ${stats.minSystolic}-${stats.maxSystolic} mmHg | Diastolic: ${stats.minDiastolic}-${stats.maxDiastolic} mmHg`,
      currentCategory: recentCategory?.category || 'Unknown',
      trends,
      alerts: alerts.length,
      recommendations: generateRecommendations(stats, recentCategory, trends),
    };
  };

  const generateRecommendations = (
    stats: BPStats,
    category: ReturnType<typeof getBPCategory> | null,
    trends: { systolicTrend: number; diastolicTrend: number }
  ): string[] => {
    const recommendations: string[] = [];

    if (!category) return recommendations;

    if (category.severity === 'crisis' || category.severity === 'high-stage2') {
      recommendations.push('⚠️ Seek immediate medical attention - High BP detected');
      recommendations.push('💊 Consult with your healthcare provider about medication');
    } else if (category.severity === 'high-stage1') {
      recommendations.push('📋 Monitor BP regularly and maintain a log');
      recommendations.push('🏃 Consider lifestyle changes: exercise, diet, stress management');
      recommendations.push('👨‍⚕️ Schedule a consultation with your doctor');
    } else if (category.severity === 'elevated') {
      recommendations.push('📊 Continue monitoring your BP regularly');
      recommendations.push('🥗 Focus on healthy diet and regular exercise');
      recommendations.push('😌 Practice stress reduction techniques');
    }

    if (trends.systolicTrend > 5 || trends.diastolicTrend > 5) {
      recommendations.push('📈 Rising trend detected - increase monitoring frequency');
    }

    if (stats.averageSystolic >= 120 && stats.averageDiastolic >= 80) {
      recommendations.push('⏰ Take readings at consistent times (morning/evening)');
    }

    return recommendations;
  };

  const chartData = prepareChartData();
  const analysisReport = getAnalysisReport();
  const lastReading = readings[0];
  const lastCategory = lastReading ? getBPCategory(lastReading.systolic, lastReading.diastolic) : null;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-gray-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              Smart BP Tracker
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {readings.length > 0 && (
              <>
                <Button
                  onClick={() => setShowChat(true)}
                  size="sm"
                  variant="outline"
                  className="border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat Analysis
                </Button>
                <div className="relative export-menu-container">
                  <Button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      <div className="py-1">
                        <button
                          onClick={exportToPDF}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <FileDown className="w-4 h-4" />
                          Export as PDF
                        </button>
                        <button
                          onClick={exportToCSV}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <FileDown className="w-4 h-4" />
                          Export as CSV
                        </button>
                        <button
                          onClick={exportToJSON}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <FileDown className="w-4 h-4" />
                          Export as JSON
                        </button>
                        <button
                          onClick={printReport}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Printer className="w-4 h-4" />
                          Print Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            <Button
              onClick={() => setShowForm(!showForm)}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Reading
            </Button>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          Track your blood pressure with visual trends and automatic alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert, index) => (
              <Alert
                key={index}
                variant={alert.severity === 'danger' ? 'destructive' : 'default'}
                className={alert.severity === 'danger' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className={alert.severity === 'danger' ? 'text-red-800' : 'text-yellow-800'}>
                  {alert.type === 'critical' ? 'Critical Alert' : 'Warning'}
                </AlertTitle>
                <AlertDescription className={alert.severity === 'danger' ? 'text-red-700' : 'text-yellow-700'}>
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Entry Form */}
        {showForm && (
          <Card className="bg-gray-50 dark:bg-gray-700 border-2 border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Add BP Reading</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="text-gray-700 dark:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                      Systolic (mmHg) *
                    </label>
                    <Input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      placeholder="120"
                      min="50"
                      max="250"
                      required
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                      Diastolic (mmHg) *
                    </label>
                    <Input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      placeholder="80"
                      min="30"
                      max="150"
                      required
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                    Pulse (bpm) - Optional
                  </label>
                  <Input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    placeholder="72"
                    min="30"
                    max="200"
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                    Notes (Optional)
                  </label>
                  <Input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Morning reading, after exercise"
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white flex-1">
                    Save Reading
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Current Reading Display */}
        {lastReading && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-1 font-medium">Latest Reading</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {lastReading.systolic}/{lastReading.diastolic}
                  <span className="text-lg text-gray-600 dark:text-gray-300 ml-2">mmHg</span>
                </div>
                {lastReading.pulse && (
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Pulse: {lastReading.pulse} bpm
                  </div>
                )}
                <div className="text-xs text-gray-700 dark:text-gray-300 mt-2 font-medium">
                  {format(parseISO(lastReading.timestamp), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
              <div className="text-right">
                <Badge
                  className={
                    lastCategory?.severity === 'crisis' || lastCategory?.severity === 'high-stage2'
                      ? 'bg-red-600 text-white'
                      : lastCategory?.severity === 'high-stage1'
                      ? 'bg-orange-500 text-white'
                      : lastCategory?.severity === 'elevated'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-green-600 text-white'
                  }
                >
                  {lastCategory?.category || 'Unknown'}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {stats && stats.readingCount > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Average BP</div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {stats.averageSystolic}/{stats.averageDiastolic}
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">mmHg</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Total Readings</div>
              <div className="text-lg font-bold text-green-700 dark:text-green-300">
                {stats.readingCount}
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">records</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
              <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Systolic Range</div>
              <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {stats.minSystolic}-{stats.maxSystolic}
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">mmHg</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
              <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Diastolic Range</div>
              <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                {stats.minDiastolic}-{stats.maxDiastolic}
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">mmHg</div>
            </div>
          </div>
        )}

        {/* BP Goals & Progress */}
        {readings.length > 0 && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  BP Goals & Progress
                </CardTitle>
                {!bpGoal && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const goal = prompt('Set your BP goal (format: systolic/diastolic, e.g., 120/80):');
                      if (goal) {
                        const [sys, dia] = goal.split('/').map(Number);
                        if (!isNaN(sys) && !isNaN(dia)) {
                          const newGoal = { systolic: sys, diastolic: dia };
                          setBPGoal(newGoal);
                          localStorage.setItem('bp_goal', JSON.stringify(newGoal));
                        }
                      }
                    }}
                    className="text-xs"
                  >
                    Set Goal
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {bpGoal ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Target Goal</div>
                      <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                        {bpGoal.systolic}/{bpGoal.diastolic} mmHg
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setBPGoal(null);
                        localStorage.removeItem('bp_goal');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {stats && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Systolic Progress</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                stats.averageSystolic <= bpGoal.systolic
                                  ? 'bg-green-500'
                                  : stats.averageSystolic <= bpGoal.systolic + 10
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{
                                width: `${Math.min(100, (bpGoal.systolic / stats.averageSystolic) * 100)}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {stats.averageSystolic <= bpGoal.systolic ? (
                              <Award className="w-4 h-4 text-green-500" />
                            ) : (
                              `${Math.round(((stats.averageSystolic - bpGoal.systolic) / bpGoal.systolic) * 100)}%`
                            )}
                          </span>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">
                          Current: {stats.averageSystolic} | Goal: {bpGoal.systolic}
                        </div>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Diastolic Progress</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                stats.averageDiastolic <= bpGoal.diastolic
                                  ? 'bg-green-500'
                                  : stats.averageDiastolic <= bpGoal.diastolic + 5
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{
                                width: `${Math.min(100, (bpGoal.diastolic / stats.averageDiastolic) * 100)}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {stats.averageDiastolic <= bpGoal.diastolic ? (
                              <Award className="w-4 h-4 text-green-500" />
                            ) : (
                              `${Math.round(((stats.averageDiastolic - bpGoal.diastolic) / bpGoal.diastolic) * 100)}%`
                            )}
                          </span>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">
                          Current: {stats.averageDiastolic} | Goal: {bpGoal.diastolic}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Set a BP goal to track your progress
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      const goal = prompt('Set your BP goal (format: systolic/diastolic, e.g., 120/80):');
                      if (goal) {
                        const [sys, dia] = goal.split('/').map(Number);
                        if (!isNaN(sys) && !isNaN(dia)) {
                          const newGoal = { systolic: sys, diastolic: dia };
                          setBPGoal(newGoal);
                          localStorage.setItem('bp_goal', JSON.stringify(newGoal));
                        }
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Set BP Goal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Period Comparison */}
        {readings.length >= 6 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                Period Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const lastWeek = getBPReadingsForPeriod('weekly');
                const lastMonth = getBPReadingsForPeriod('monthly');
                const weekStats = calculateBPStats(lastWeek);
                const monthStats = calculateBPStats(lastMonth);
                
                const weekComparison = stats && weekStats.readingCount > 0
                  ? {
                      systolic: stats.averageSystolic - weekStats.averageSystolic,
                      diastolic: stats.averageDiastolic - weekStats.averageDiastolic,
                    }
                  : null;
                
                const monthComparison = stats && monthStats.readingCount > 0
                  ? {
                      systolic: stats.averageSystolic - monthStats.averageSystolic,
                      diastolic: stats.averageDiastolic - monthStats.averageDiastolic,
                    }
                  : null;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weekComparison && (
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          vs Last Week
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-300">Systolic:</span>
                            <div className="flex items-center gap-1">
                              {weekComparison.systolic < 0 ? (
                                <TrendingDown className="w-4 h-4 text-green-500" />
                              ) : weekComparison.systolic > 0 ? (
                                <TrendingUp className="w-4 h-4 text-red-500" />
                              ) : null}
                              <span className={`text-sm font-semibold ${
                                weekComparison.systolic < 0 ? 'text-green-600 dark:text-green-400' : 
                                weekComparison.systolic > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {weekComparison.systolic > 0 ? '+' : ''}{weekComparison.systolic.toFixed(1)} mmHg
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-300">Diastolic:</span>
                            <div className="flex items-center gap-1">
                              {weekComparison.diastolic < 0 ? (
                                <TrendingDown className="w-4 h-4 text-green-500" />
                              ) : weekComparison.diastolic > 0 ? (
                                <TrendingUp className="w-4 h-4 text-red-500" />
                              ) : null}
                              <span className={`text-sm font-semibold ${
                                weekComparison.diastolic < 0 ? 'text-green-600 dark:text-green-400' : 
                                weekComparison.diastolic > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {weekComparison.diastolic > 0 ? '+' : ''}{weekComparison.diastolic.toFixed(1)} mmHg
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {monthComparison && (
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          vs Last Month
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-300">Systolic:</span>
                            <div className="flex items-center gap-1">
                              {monthComparison.systolic < 0 ? (
                                <TrendingDown className="w-4 h-4 text-green-500" />
                              ) : monthComparison.systolic > 0 ? (
                                <TrendingUp className="w-4 h-4 text-red-500" />
                              ) : null}
                              <span className={`text-sm font-semibold ${
                                monthComparison.systolic < 0 ? 'text-green-600 dark:text-green-400' : 
                                monthComparison.systolic > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {monthComparison.systolic > 0 ? '+' : ''}{monthComparison.systolic.toFixed(1)} mmHg
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-300">Diastolic:</span>
                            <div className="flex items-center gap-1">
                              {monthComparison.diastolic < 0 ? (
                                <TrendingDown className="w-4 h-4 text-green-500" />
                              ) : monthComparison.diastolic > 0 ? (
                                <TrendingUp className="w-4 h-4 text-red-500" />
                              ) : null}
                              <span className={`text-sm font-semibold ${
                                monthComparison.diastolic < 0 ? 'text-green-600 dark:text-green-400' : 
                                monthComparison.diastolic > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {monthComparison.diastolic > 0 ? '+' : ''}{monthComparison.diastolic.toFixed(1)} mmHg
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Health Tips */}
        {readings.length > 0 && stats && (
          <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                Personalized Health Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(() => {
                  const tips: string[] = [];
                  const avgCategory = getBPCategory(stats.averageSystolic, stats.averageDiastolic);
                  
                  if (avgCategory.severity === 'high-stage1' || avgCategory.severity === 'high-stage2') {
                    tips.push('💊 Consider consulting with your healthcare provider about BP management');
                    tips.push('🧂 Reduce sodium intake - aim for less than 2,300mg per day');
                    tips.push('🏃 Engage in regular physical activity - 30 minutes most days');
                    tips.push('😌 Practice stress management techniques like meditation or deep breathing');
                  } else if (avgCategory.severity === 'elevated') {
                    tips.push('📊 Continue monitoring your BP regularly');
                    tips.push('🥗 Focus on a heart-healthy diet rich in fruits and vegetables');
                    tips.push('⚖️ Maintain a healthy weight');
                    tips.push('🚭 Avoid smoking and limit alcohol consumption');
                  } else {
                    tips.push('✅ Great job maintaining healthy BP levels!');
                    tips.push('📋 Continue regular monitoring to maintain this level');
                    tips.push('🏋️ Keep up with regular exercise and healthy eating');
                  }
                  
                  if (stats.averageSystolic >= 120 || stats.averageDiastolic >= 80) {
                    tips.push('⏰ Take readings at consistent times (morning/evening) for better tracking');
                  }
                  
                  if (readings.length < 7) {
                    tips.push('📈 Track more readings to get better insights into your BP patterns');
                  }
                  
                  return tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-white dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300">
                      <span>{tip}</span>
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* BP Guidelines Info */}
        {readings.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                BP Guidelines Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <span className="text-gray-700 dark:text-gray-300">Normal:</span>
                    <Badge className="bg-green-600 text-white">Below 120/80</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <span className="text-gray-700 dark:text-gray-300">Elevated:</span>
                    <Badge className="bg-yellow-500 text-white">120-129/&lt;80</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <span className="text-gray-700 dark:text-gray-300">High Stage 1:</span>
                    <Badge className="bg-orange-500 text-white">130-139/80-89</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <span className="text-gray-700 dark:text-gray-300">High Stage 2:</span>
                    <Badge className="bg-red-600 text-white">140+/90+</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <span className="text-gray-700 dark:text-gray-300">Crisis:</span>
                    <Badge className="bg-red-700 text-white">180+/120+</Badge>
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 mt-2 italic font-medium">
                    * Consult healthcare provider for personalized targets
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        {readings.length > 0 && (
          <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as typeof selectedPeriod)}>
            <TabsList className="grid w-full grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="daily" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-700 data-[state=active]:font-semibold rounded-md py-2.5 text-sm font-medium transition-all text-gray-800 hover:text-gray-900"
              >
                Daily
              </TabsTrigger>
              <TabsTrigger 
                value="weekly" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-700 data-[state=active]:font-semibold rounded-md py-2.5 text-sm font-medium transition-all text-gray-800 hover:text-gray-900"
              >
                Weekly
              </TabsTrigger>
              <TabsTrigger 
                value="monthly" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-700 data-[state=active]:font-semibold rounded-md py-2.5 text-sm font-medium transition-all text-gray-800 hover:text-gray-900"
              >
                Monthly
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedPeriod} className="mt-4">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <BarChart3 className="w-5 h-5" />
                    BP Trends - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280"
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis 
                          domain={[0, 200]} 
                          stroke="#6b7280"
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            color: '#111827'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ color: '#374151', fontSize: '14px' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="systolic"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="Systolic (mmHg)"
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="diastolic"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Diastolic (mmHg)"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        No readings available for {selectedPeriod} period
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Add readings to see trends
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Analysis Report */}
        {analysisReport && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <FileText className="w-5 h-5" />
                Analysis Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Period:</span>
                  <span className="font-semibold ml-2 capitalize text-gray-900 dark:text-gray-100">{analysisReport.period}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Readings:</span>
                  <span className="font-semibold ml-2 text-gray-900 dark:text-gray-100">{analysisReport.totalReadings}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Average BP:</span>
                  <span className="font-semibold ml-2 text-gray-900 dark:text-gray-100">{analysisReport.averageBP}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Current Status:</span>
                  <span className="font-semibold ml-2 text-gray-900 dark:text-gray-100">{analysisReport.currentCategory}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">BP Range:</div>
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{analysisReport.range}</div>
              </div>

              {analysisReport.recommendations.length > 0 && (
                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Recommendations:</div>
                  <ul className="space-y-1">
                    {analysisReport.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2 font-medium">
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Readings List */}
        {readings.length > 0 && (
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Recent Readings</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {readings.length} total
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {readings.slice(0, 10).map((reading) => {
                  const category = getBPCategory(reading.systolic, reading.diastolic);
                  return (
                    <div
                      key={reading.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {reading.systolic}/{reading.diastolic}
                            <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">mmHg</span>
                          </div>
                          <Badge
                            className={
                              category.severity === 'crisis' || category.severity === 'high-stage2'
                                ? 'bg-red-600 text-white'
                                : category.severity === 'high-stage1'
                                ? 'bg-orange-500 text-white'
                                : category.severity === 'elevated'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-green-600 text-white'
                            }
                          >
                            {category.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                          {format(parseISO(reading.timestamp), 'MMM dd, yyyy HH:mm')}
                          {reading.notes && ` • ${reading.notes}`}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(reading.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {readings.length === 0 && (
          <div className="text-center py-8 space-y-4">
            <Heart className="w-16 h-16 mx-auto text-gray-600 dark:text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No BP readings yet</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                Start tracking your blood pressure by adding your first reading
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Reading
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* BP Analysis Chat */}
      <BPChatBot
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        readings={readings}
        stats={stats}
      />
    </Card>
  );
};

export default BPTracker;

