import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Trophy } from "lucide-react";

interface ProfileCardProps {
  displayName: string;
  email: string;
  joinDate: string;
  currentLevel: number;
  totalXP: number;
}

export default function ProfileCard({
  displayName,
  email,
  joinDate,
  currentLevel,
  totalXP
}: ProfileCardProps) {
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold" data-testid="text-profile-name">{displayName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="gap-1">
                <Trophy className="w-3 h-3" />
                Level {currentLevel}
              </Badge>
              <Badge variant="outline">{totalXP} XP</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Joined {joinDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
