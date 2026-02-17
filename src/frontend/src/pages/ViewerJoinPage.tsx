import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { useIsValidSessionCode } from '../hooks/useQueries';
import { useSessionCode } from '../hooks/useSessionCode';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ViewerJoinPage() {
  const [inputCode, setInputCode] = useState('');
  const [validationResult, setValidationResult] = useState<boolean | null>(null);
  const { setSessionCode } = useSessionCode();
  const navigate = useNavigate();

  const validateMutation = useIsValidSessionCode();

  const handleJoin = async () => {
    const code = inputCode.trim().toUpperCase();
    if (code.length === 6) {
      try {
        const isValid = await validateMutation.mutateAsync(code);
        setValidationResult(isValid);
        if (isValid) {
          setSessionCode(code);
          navigate({ to: '/watch/$sessionCode', params: { sessionCode: code } });
        }
      } catch (error) {
        setValidationResult(false);
      }
    }
  };

  const showError = validationResult === false && !validateMutation.isPending;

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md border-2">
        <CardHeader>
          <CardTitle className="text-3xl scoreboard-text">Enter Session Code</CardTitle>
          <CardDescription>
            Enter the 6-character code provided by the broadcaster
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-code">Session Code</Label>
            <Input
              id="session-code"
              placeholder="ABC123"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                setValidationResult(null);
              }}
              maxLength={6}
              className="text-2xl text-center scoreboard-text tracking-widest"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleJoin();
                }
              }}
            />
          </div>

          {showError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Invalid or expired session code. Please check and try again.
              </AlertDescription>
            </Alert>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={handleJoin}
            disabled={inputCode.length !== 6 || validateMutation.isPending}
          >
            {validateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              'Join Session'
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate({ to: '/' })}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
