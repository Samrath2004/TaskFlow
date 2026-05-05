import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const TaskStatusChart = ({ tasksByStatus }) => {
  const data = [
    { name: 'To Do', value: tasksByStatus.todo || 0, color: '#94a3b8' },
    { name: 'In Progress', value: tasksByStatus.in_progress || 0, color: '#3b82f6' },
    { name: 'Done', value: tasksByStatus.done || 0, color: '#10b981' }
  ];

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 shadow-sm border border-surface-200 dark:border-surface-700 h-full hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-6">Tasks by Status</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskStatusChart;
