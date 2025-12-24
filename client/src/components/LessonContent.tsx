import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface LessonContentProps {
  title: string;
  content: string;
  isCompleted?: boolean;
  levelName?: string;
}

export default function LessonContent({ title, content, isCompleted, levelName }: LessonContentProps) {
  return (
    <Card>
      <CardHeader className="gap-2">
        {levelName && (
          <div className="text-sm text-muted-foreground">
            {levelName}
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {isCompleted && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none dark:prose-invert">
        <div 
          className="space-y-4 text-foreground [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_code]:text-foreground [&_pre_code]:bg-transparent"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
}
