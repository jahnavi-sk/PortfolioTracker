"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

const salesData = [
  { month: 'Jan 20', brutto: 350, netto: 100, AAPL: 243 },
  { month: 'Feb 20', brutto: 370, netto: 280, AAPL: 244 },
  { month: 'Mar 20', brutto: 550, netto: 400, AAPL: 224 },
  { month: 'Apr 20', brutto: 120, netto: 300, AAPL: 256 },
  { month: 'May 20', brutto: 800, netto: 450, AAPL: 221 },
  { month: 'Jun 20', brutto: 350, netto: 250,AAPL: 244 },
  { month: 'Jul 20', brutto: 250, netto: 350, AAPL: 248 },
  { month: 'Aug 20', brutto: 350, netto: 450,AAPL: 243 },
  { month: 'Sep 2', brutto: 15000, netto: 350,AAPL: 247},
];

const eventData = [
  { name: 'Event 1', value: 50, color: '#3b82f6' },
  { name: 'Event 2', value: 25, color: '#10b981' },
  { name: 'Event 3', value: 15, color: '#fbbf24' },
  { name: 'Event 4', value: 10, color: '#f97316' },
];

const colors = [
    '#10b981', // emerald
    '#3b82f6', // blue
    '#f97316', // orange
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f59e0b', // amber
    '#6366f1', // indigo
    '#ef4444', // red
  ];

export default function SalesDashboard(){
    const dataKeys = Object.keys(salesData[0]).filter(key => key !== 'month');
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sales Netto Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Sales netto</p>
              <div className="flex items-center space-x-2">
                <h2 className="text-3xl font-bold">306.20€</h2>
                <div className="flex items-center text-red-500 text-sm">
                  <ArrowDownIcon className="h-4 w-4" />
                  <span>1.3% than last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Brutto Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Sales brutto</p>
              <div className="flex items-center space-x-2">
                <h2 className="text-3xl font-bold">765.20€</h2>
                <div className="flex items-center text-red-500 text-sm">
                  <ArrowDownIcon className="h-4 w-4" />
                  <span>1.2% than last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Tickets</p>
              <div className="flex items-center space-x-2">
                <h2 className="text-3xl font-bold">3,137</h2>
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUpIcon className="h-4 w-4" />
                  <span>2.3% than last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sales Report Chart */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sales Report</span>
                <button className="px-4 py-2 text-sm text-gray-600 border rounded-md">
                  Export
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 500]} />
                    <Tooltip />
                    {dataKeys.map((key, index) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colors[index % colors.length]}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                {dataKeys.map((key, index) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm text-gray-600">{key}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Event Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {eventData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {eventData.map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <span className="text-sm text-gray-600">{event.name}</span>
                  </div>
                  <span className="text-sm font-medium">{event.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};




