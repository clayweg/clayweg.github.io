const mockLogs = [
    { time: '08:15:42 AM', ip: '192.168.1.2', port: '443', protocol: 'TCP', action: 'Allow' },
    { time: '08:20:55 AM', ip: '10.0.0.5', port: '22', protocol: 'TCP', action: 'Block' },
    { time: '08:35:53 AM', ip: '192.168.1.12', port: '53', protocol: 'UDP', action: 'Allow' },
    { time: '08:40:24 AM', ip: '172.16.0.9', port: '443', protocol: 'TCP', action: 'Block' },
    { time: '08:50:37 AM', ip: '192.168.1.20', port: '80', protocol: 'TCP', action: 'Allow' },
  ];
  

  const logBody = document.getElementById('log-body');
  mockLogs.forEach(log => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${log.time}</td>
      <td>${log.ip}</td>
      <td>${log.port}</td>
      <td>${log.protocol}</td>
      <td>${log.action}</td>
    `;
    logBody.appendChild(row);
  });


  document.getElementById('rule-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const action = document.getElementById('action').value;
    const direction = document.getElementById('direction').value;
    const protocol = document.getElementById('protocol').value;
    const port = document.getElementById('port').value.trim();
    const ip = document.getElementById('ip').value.trim();
  
    if (!port || !ip) {
      alert('Please enter both IP and Port.');
      return;
    }
  
    const now = new Date();
    const time = now.toLocaleTimeString();
  
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${time}</td>
      <td>${ip}</td>
      <td>${port}</td>
      <td>${protocol}</td>
      <td>${action}</td>
    `;
    logBody.appendChild(row);
  
    updateCharts(action, protocol);
  
    document.getElementById('rule-form').reset();
  });
  
  let actionCounts = { Allowed: 3, Blocked: 2 };
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  const pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ['Allowed', 'Blocked'],
      datasets: [{
        data: [actionCounts.Allowed, actionCounts.Blocked],
        backgroundColor: ['#10b981', '#ef4444'],
      }]
    }
  });
  
  
  let protocolCounts = { TCP: 4, UDP: 1, ICMP: 0 };
  const barCtx = document.getElementById('barChart').getContext('2d');
  const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['TCP', 'UDP', 'ICMP'],
      datasets: [{
        label: 'Connections',
        data: [protocolCounts.TCP, protocolCounts.UDP, protocolCounts.ICMP],
        backgroundColor: ['#3b82f6', '#f59e0b', '#8b5cf6']
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
  function updateCharts(action, protocol) {
    if (action === 'Block') {
      actionCounts.Blocked++;
    } else {
      actionCounts.Allowed++;
    }
  
    if (protocolCounts[protocol] !== undefined) {
      protocolCounts[protocol]++;
    } else {
      protocolCounts[protocol] = 1;
    }
  
    pieChart.data.datasets[0].data = [actionCounts.Allowed, actionCounts.Blocked];
    pieChart.update();
  
    barChart.data.datasets[0].data = [
      protocolCounts.TCP || 0,
      protocolCounts.UDP || 0,
      protocolCounts.ICMP || 0
    ];
    barChart.update();
  }
  
