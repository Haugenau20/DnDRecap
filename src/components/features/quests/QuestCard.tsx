import React, { useState, useEffect } from 'react';
import { Quest } from '../../../types/quest';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Button from '../../core/Button';
import ReactMarkdown from 'react-markdown';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin,
  Users,
  Scroll,
  Calendar,
  Target
} from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [markdownContent, setMarkdownContent] = useState<string>('');

  // Load markdown content when expanded
  useEffect(() => {
    if (isExpanded && quest.contentFile) {
      // Import markdown content using webpack's raw-loader
      import(`../../../data/quests/content/${quest.contentFile}`)
        .then(content => {
          setMarkdownContent(content.default);
        })
        .catch(error => console.error('Error loading quest content:', error));
    }
  }, [isExpanded, quest.contentFile]);

  // Calculate completion percentage
  const completedObjectives = quest.objectives.filter(obj => obj.completed).length;
  const completionPercentage = Math.round(
    (completedObjectives / quest.objectives.length) * 100
  );

  return (
    <Card className="w-full">
      <Card.Content className="space-y-4">
        {/* Quest Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Typography variant="h3">
                {quest.title}
              </Typography>
              <span className={`px-2 py-1 rounded-full text-sm ${
                quest.status === 'completed' ? 'bg-green-100 text-green-800' :
                quest.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {quest.status.charAt(0).toUpperCase() + quest.status.slice(1)}
              </span>
            </div>
            <Typography color="secondary" className="mt-1">
              {quest.description}
            </Typography>
          </div>
        </div>

        {/* Quest Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quest.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <Typography color="secondary">Location: {quest.location}</Typography>
            </div>
          )}
          {quest.levelRange && (
            <div className="flex items-center gap-2">
              <Target size={16} className="text-gray-500" />
              <Typography color="secondary">Level: {quest.levelRange}</Typography>
            </div>
          )}
          {quest.dateAdded && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <Typography color="secondary">Added: {quest.dateAdded}</Typography>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 rounded-full h-2 transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="pt-4 space-y-6">
            {/* Objectives Section */}
            <div>
              <Typography variant="h4" className="mb-2">
                Objectives
              </Typography>
              <div className="space-y-2">
                {quest.objectives.map(objective => (
                  <div 
                    key={objective.id}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-4 h-4 rounded border ${
                      objective.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`} />
                    <Typography
                      color={objective.completed ? 'secondary' : 'default'}
                      className={objective.completed ? 'line-through' : ''}
                    >
                      {objective.description}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards Section */}
            {quest.rewards && quest.rewards.length > 0 && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Rewards
                </Typography>
                <ul className="list-disc list-inside space-y-1">
                  {quest.rewards.map((reward, index) => (
                    <li key={index}>
                      <Typography>{reward}</Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related NPCs Section */}
            {quest.relatedNPCs && quest.relatedNPCs.length > 0 && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Related NPCs
                </Typography>
                <ul className="list-disc list-inside space-y-1">
                  {quest.relatedNPCs.map((npc, index) => (
                    <li key={index}>
                      <Typography>{npc}</Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Markdown Content */}
            {markdownContent && (
              <div className="prose max-w-none dark:prose-invert">
                <ReactMarkdown>{markdownContent}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
          startIcon={isExpanded ? <ChevronUp /> : <ChevronDown />}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </Card.Content>
    </Card>
  );
};

export default QuestCard;