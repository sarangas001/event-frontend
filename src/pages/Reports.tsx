import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Reports = () => {
  const notificationData = [
    { name: "Month 1", location1: 140, location2: 220, location3: 200, location4: 140, location5: 150 },
    { name: "", location1: 120, location2: 250, location3: 220, location4: 160, location5: 155 },
    { name: "", location1: 200, location2: 265, location3: 210, location4: 140, location5: 145 },
    { name: "", location1: 180, location2: 240, location3: 190, location4: 150, location5: 165 },
    { name: "", location1: 160, location2: 280, location3: 185, location4: 115, location5: 155 },
    { name: "", location1: 220, location2: 250, location3: 195, location4: 170, location5: 160 },
    { name: "", location1: 240, location2: 220, location3: 200, location4: 180, location5: 155 },
    { name: "", location1: 180, location2: 200, location3: 205, location4: 165, location5: 165 },
    { name: "Month 2", location1: 170, location2: 185, location3: 210, location4: 175, location5: 170 },
    { name: "", location1: 160, location2: 180, location3: 195, location4: 180, location5: 160 },
    { name: "", location1: 185, location2: 215, location3: 190, location4: 195, location5: 165 },
    { name: "", location1: 175, location2: 190, location3: 185, location4: 220, location5: 155 },
    { name: "", location1: 240, location2: 175, location3: 180, location4: 230, location5: 145 },
    { name: "", location1: 245, location2: 165, location3: 190, location4: 235, location5: 160 },
    { name: "", location1: 270, location2: 210, location3: 145, location4: 240, location5: 180 },
    { name: "Month 3", location1: 265, location2: 190, location3: 140, location4: 130, location5: 185 },
  ];

  const heatmapData = [
    [0.2, 0.4, 0.6, 0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7, 0.9, 0.6, 0.8, 0.3, 0.5, 0.7, 0.4, 0.6, 0.8],
    [0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7, 0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7, 0.9, 0.6, 0.8, 0.3, 0.5],
    [0.3, 0.5, 0.7, 0.9, 0.6, 0.8, 0.3, 0.5, 0.7, 0.4, 0.6, 0.2, 0.4, 0.6, 0.8, 0.5, 0.7, 0.4, 0.6, 0.8],
    [0.6, 0.8, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7, 0.9, 0.6, 0.8, 0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7],
    [0.4, 0.6, 0.8, 0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7, 0.9, 0.6, 0.8, 0.3],
    [0.7, 0.4, 0.6, 0.8, 0.5, 0.2, 0.4, 0.6, 0.3, 0.5, 0.7, 0.9, 0.6, 0.8, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5],
    [0.5, 0.7, 0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7, 0.4, 0.6, 0.8, 0.2, 0.4, 0.6, 0.8, 0.5, 0.7, 0.9],
  ];

  const metrics = ["Metric1", "Metric7", "Metric6", "Metric5", "Metric4", "Metric3", "Metric2"];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>

        {/* Line Chart - Number of Notifications */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-6">Number of notifications</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={notificationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 300]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="location1" stroke="#22c55e" strokeWidth={2} dot={false} name="location1" />
                <Line type="monotone" dataKey="location2" stroke="#3b82f6" strokeWidth={2} dot={false} name="location2" />
                <Line type="monotone" dataKey="location3" stroke="#ef4444" strokeWidth={2} dot={false} name="location3" />
                <Line type="monotone" dataKey="location4" stroke="#ca8a04" strokeWidth={2} dot={false} name="location4" />
                <Line type="monotone" dataKey="location5" stroke="#1e293b" strokeWidth={2} dot={false} name="location5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-6">HeatMap Chart (Single color)</h2>
          <div className="overflow-x-auto">
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 mr-2">
                {metrics.map((metric) => (
                  <div key={metric} className="h-8 flex items-center text-xs text-muted-foreground">
                    {metric}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="w-8 h-4 flex items-end justify-center text-xs text-muted-foreground">
                      {i + 1}
                    </div>
                  ))}
                </div>
                {heatmapData.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1">
                    {row.map((value, colIdx) => (
                      <div
                        key={colIdx}
                        className="w-8 h-8 rounded"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${value})`,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
