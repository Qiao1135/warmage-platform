'use client';

interface Topic {
  id: number;
  name: string;
  icon: string;
  count: number;
}

interface TopicTagsProps {
  topics: Topic[];
  selectedId?: number;
  onSelect?: (topic: Topic) => void;
  followedIds?: number[];
  onFollow?: (topicId: number) => void;
}

export function TopicTags({ 
  topics, 
  selectedId, 
  onSelect,
  followedIds = [],
  onFollow 
}: TopicTagsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
      {topics.map((topic) => {
        const isSelected = selectedId === topic.id;
        const isFollowed = followedIds.includes(topic.id);
        
        return (
          <div
            key={topic.id}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${
              isSelected 
                ? 'bg-[#FF6B6B] text-white' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
            onClick={() => onSelect?.(topic)}
          >
            <span className="text-lg">{topic.icon}</span>
            <span className="font-medium whitespace-nowrap">{topic.name}</span>
            {!isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFollow?.(topic.id);
                }}
                className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                  isFollowed
                    ? 'bg-[#FF6B6B] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-[#FFE0E0] hover:text-[#FF6B6B]'
                }`}
              >
                {isFollowed ? '已关注' : '+ 关注'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
