import React from 'react';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import {
  Shield,
  Skull,
  AlertCircle,
  HelpCircle,
  Heart,
  SwordIcon
} from 'lucide-react';

const NPCLegend: React.FC = () => {
  const statusTypes = [
    { icon: <Shield className="text-green-500" />, label: 'Active', description: 'NPC is currently active in the campaign' },
    { icon: <Skull className="text-gray-500" />, label: 'Deceased', description: 'NPC is no longer living' },
    { icon: <AlertCircle className="text-yellow-500" />, label: 'Missing', description: 'NPC\'s whereabouts are unknown' },
    { icon: <HelpCircle className="text-gray-400" />, label: 'Unknown', description: 'NPC\'s status is uncertain' }
  ];

  const relationshipTypes = [
    { icon: <Heart className="text-green-500" />, label: 'Friendly', description: 'Ally or friend to the party' },
    { icon: <Shield className="text-gray-400" />, label: 'Neutral', description: 'Neither friend nor foe' },
    { icon: <SwordIcon className="text-red-500" />, label: 'Hostile', description: 'Enemy or opponent of the party' },
    { icon: <HelpCircle className="text-gray-400" />, label: 'Unknown', description: 'Relationship not yet determined' }
  ];

  return (
    <Card>
      <Card.Content className="space-y-6">
        {/* Status Types */}
        <div>
          <Typography variant="h4" className="mb-3">NPC Status Types</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statusTypes.map(({ icon, label, description }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-1">{icon}</div>
                <div>
                  <Typography variant="body" className="font-medium">
                    {label}
                  </Typography>
                  <Typography variant="body-sm" color="secondary">
                    {description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Relationship Types */}
        <div>
          <Typography variant="h4" className="mb-3">Relationship Types</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relationshipTypes.map(({ icon, label, description }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-1">{icon}</div>
                <div>
                  <Typography variant="body" className="font-medium">
                    {label}
                  </Typography>
                  <Typography variant="body-sm" color="secondary">
                    {description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default NPCLegend;