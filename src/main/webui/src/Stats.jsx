import { PageSection, Title, Card, CardTitle, CardBody, Gallery, GalleryItem, Flex, FlexItem, Divider, Tooltip } from '@patternfly/react-core';
import { ChartPieIcon, CheckCircleIcon, TimesCircleIcon, ListIcon, CodeIcon, ExclamationTriangleIcon, RepositoryIcon, BugIcon, BanIcon } from '@patternfly/react-icons';


const metrics = [
  { title: 'Total Reports', value: 42, icon: <ListIcon /> },
  { title: 'Completed Reports', value: 31, icon: <CheckCircleIcon color="green" /> },
  { title: 'Failed Reports', value: 11, icon: <TimesCircleIcon color="red" /> },
  { title: 'CVEs Analyzed', value: 98, icon: <ChartPieIcon /> },
  { title: 'Unique CVEs', value: 67, icon: <CodeIcon /> },
  { title: 'Code Not Reachable Cases', value: 13, icon: <ExclamationTriangleIcon color="orange" /> },
  { title: 'Repositories Scanned', value: 57, icon: <RepositoryIcon /> },
  { title: 'Trackers Opened', value: 134, icon: <BugIcon /> },
  { title: 'False Positives', value: 12, icon: <BanIcon color="red" /> },
];

const reportsPerDayData = [
  { day: 'Mon', count: 5 },
  { day: 'Tue', count: 7 },
  { day: 'Wed', count: 4 },
  { day: 'Thu', count: 8 },
  { day: 'Fri', count: 7 },
];

const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.count));
  
  return (
    <div style={{ display: 'flex', alignItems: 'end', height: '200px', gap: '10px', padding: '20px' }}>
      {data.map((item, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div
            style={{
              width: '40px',
              height: `${(item.count / maxValue) * 150}px`,
              backgroundColor: '#4cb140',
              marginBottom: '8px',
              borderRadius: '4px 4px 0 0',
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              paddingBottom: '4px'
            }}
          >
            {item.count}
          </div>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.day}</span>
        </div>
      ))}
    </div>
  );
};

const SimpleDonutChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;
  
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    cumulativePercentage += percentage;
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
    
    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ');
    
    return {
      ...item,
      percentage: Math.round(percentage),
      pathData,
      color: index === 0 ? '#4cb140' : '#c9190b'
    };
  });
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg width="200" height="200" viewBox="0 0 100 100">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.pathData}
            fill={segment.color}
            stroke="white"
            strokeWidth="0.5"
          />
        ))}
        <circle cx="50" cy="50" r="20" fill="white" />
        <text x="50" y="46" textAnchor="middle" fontSize="8" fontWeight="bold">
          Total
        </text>
        <text x="50" y="56" textAnchor="middle" fontSize="10" fontWeight="bold">
          {total}
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {segments.map((segment, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: segment.color,
                borderRadius: '2px'
              }}
            />
            <span style={{ fontSize: '14px' }}>
              {segment.label}: {segment.value} ({segment.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const statusBreakdownData = [
  { label: 'Completed', value: 31 },
  { label: 'Failed', value: 11 }
];

const SimpleHeatmap = ({ data }) => {
  const maxCount = Math.max(...data.map(item => item.count));
  
  const getIntensity = (count) => {
    const intensity = count / maxCount;
    return Math.max(0.1, intensity); // Minimum 10% opacity
  };
  
  const getColor = (count) => {
    const intensity = getIntensity(count);
    // Use red color with varying opacity for heatmap effect
    return `rgba(201, 25, 11, ${intensity})`;
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '8px',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: getColor(item.count),
              color: getIntensity(item.count) > 0.5 ? 'white' : 'black',
              padding: '12px 8px',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              border: '1px solid #ddd',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 'normal' }}>
              {item.cve}
            </div>
            <div>
              {item.count}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        <span>Frequency:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(201, 25, 11, 0.2)', border: '1px solid #ddd' }}></div>
          <span>Low</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(201, 25, 11, 0.6)', border: '1px solid #ddd' }}></div>
          <span>Medium</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(201, 25, 11, 1)', border: '1px solid #ddd' }}></div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

const mostFrequentCVEs = [
  { cve: 'CVE-2023-1234', count: 15 },
  { cve: 'CVE-2023-5678', count: 12 },
  { cve: 'CVE-2023-9012', count: 8 },
  { cve: 'CVE-2023-3456', count: 7 },
  { cve: 'CVE-2023-7890', count: 6 },
  { cve: 'CVE-2023-2345', count: 5 },
  { cve: 'CVE-2023-6789', count: 4 },
  { cve: 'CVE-2023-0123', count: 3 },
  { cve: 'CVE-2023-4567', count: 2 },
  { cve: 'CVE-2023-8901', count: 1 },
];

const SimpleSeverityBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.count));
  
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return '#c9190b'; // Dark red
      case 'high': return '#ec7a08';     // Orange-red
      case 'medium': return '#f0ab00';   // Yellow/orange
      case 'low': return '#2b9af3';      // Blue
      default: return '#6a6e73';         // Gray
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              minWidth: '80px', 
              textAlign: 'right', 
              fontSize: '14px', 
              fontWeight: 'bold' 
            }}>
              {item.severity}
            </div>
            <div style={{ 
              minWidth: '80px', 
              fontSize: '12px', 
              color: '#6a6e73',
              textAlign: 'center'
            }}>
              {item.range}
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: `${(item.count / maxValue) * 100}%`,
                  minWidth: '30px',
                  height: '24px',
                  backgroundColor: getSeverityColor(item.severity),
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '8px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                {item.count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const cvesBySeverityData = [
  { severity: 'Critical', range: '9.0 - 10.0', count: 6 },
  { severity: 'High', range: '7.0 - 8.9', count: 15 },
  { severity: 'Medium', range: '4.0 - 6.9', count: 24 },
  { severity: 'Low', range: '0.1 - 3.9', count: 12 },
];

export default function Stats() {
  // All data is managed in state, simulating dynamic fetching
  const [metrics, setMetrics] = React.useState([
    { title: 'Total Reports', value: 42, icon: <ListIcon /> },
    { title: 'Completed Reports', value: 31, icon: <CheckCircleIcon color="green" /> },
    { title: 'Failed Reports', value: 11, icon: <TimesCircleIcon color="red" /> },
    { title: 'CVEs Analyzed', value: 98, icon: <ChartPieIcon /> },
    { title: 'Unique CVEs', value: 67, icon: <CodeIcon /> },
    { title: 'Code Not Reachable Cases', value: 13, icon: <ExclamationTriangleIcon color="orange" /> },
    { title: 'Repositories Scanned', value: 57, icon: <RepositoryIcon /> },
    { title: 'Trackers Opened', value: 134, icon: <BugIcon /> },
    { title: 'False Positives', value: 12, icon: <BanIcon color="red" /> },
  ]);

  const [reportsPerDayData, setReportsPerDayData] = React.useState([
    { day: 'Mon', count: 5 },
    { day: 'Tue', count: 7 },
    { day: 'Wed', count: 4 },
    { day: 'Thu', count: 8 },
    { day: 'Fri', count: 7 },
  ]);

  const [statusBreakdownData, setStatusBreakdownData] = React.useState([
    { label: 'Completed', value: 31 },
    { label: 'Failed', value: 11 }
  ]);

  const [mostFrequentCVEs, setMostFrequentCVEs] = React.useState([
    { cve: 'CVE-2023-1234', count: 15 },
    { cve: 'CVE-2023-5678', count: 12 },
    { cve: 'CVE-2023-9012', count: 8 },
    { cve: 'CVE-2023-3456', count: 7 },
    { cve: 'CVE-2023-7890', count: 6 },
    { cve: 'CVE-2023-2345', count: 5 },
    { cve: 'CVE-2023-6789', count: 4 },
    { cve: 'CVE-2023-0123', count: 3 },
    { cve: 'CVE-2023-4567', count: 2 },
    { cve: 'CVE-2023-8901', count: 1 },
  ]);

  const [cvesBySeverityData, setCvesBySeverityData] = React.useState([
    { severity: 'Critical', range: '9.0 - 10.0', count: 6 },
    { severity: 'High', range: '7.0 - 8.9', count: 15 },
    { severity: 'Medium', range: '4.0 - 6.9', count: 24 },
    { severity: 'Low', range: '0.1 - 3.9', count: 12 },
  ]);

  // In the future, useEffect can fetch and update these states from an API

  return (
    <PageSection>
      <Title headingLevel="h1">Stats</Title>
      <Gallery hasGutter style={{ 
        marginTop: 24, 
        marginBottom: 24,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {metrics.map((m, i) => (
          <GalleryItem key={i}>
            <Card isCompact isFlat style={{ minWidth: 200 }}>
              <CardTitle>
                <Flex alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>{m.icon}</FlexItem>
                  <FlexItem grow={{ default: 'grow' }} style={{ marginLeft: 8 }}>
                    {m.title === 'False Positives' ? (
                      <Tooltip content="Based on CVE justifications labeled as false positives">
                        <span style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
                          {m.title}
                        </span>
                      </Tooltip>
                    ) : (
                      m.title
                    )}
                  </FlexItem>
                </Flex>
              </CardTitle>
              <CardBody>
                <Title headingLevel="h2" size="2xl">{m.value}</Title>
              </CardBody>
            </Card>
          </GalleryItem>
        ))}
      </Gallery>
      <Divider style={{ margin: '32px 0' }} />
      <Gallery hasGutter style={{ 
        marginTop: 24,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '16px'
      }}>
        <GalleryItem>
          <Card isFlat style={{ height: '300px' }}>
            <CardTitle>Reports Submitted Per Day</CardTitle>
            <CardBody>
              <SimpleBarChart data={reportsPerDayData} />
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card isFlat style={{ height: '300px' }}>
            <CardTitle>Status Breakdown</CardTitle>
            <CardBody>
              <SimpleDonutChart data={statusBreakdownData} />
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card isFlat style={{ height: '360px' }}>
            <CardTitle>Most Frequent CVEs</CardTitle>
            <CardBody>
              <SimpleHeatmap data={mostFrequentCVEs} />
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card isFlat style={{ height: '300px' }}>
            <CardTitle>CVEs by Severity</CardTitle>
            <CardBody>
              <SimpleSeverityBarChart data={cvesBySeverityData} />
            </CardBody>
          </Card>
        </GalleryItem>
      </Gallery>
    </PageSection>
  );
} 