import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Server, FileJson, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Step = ({ icon, title, description, status }) => {
  return (
    <div className="flex gap-3 items-start">
      <div
        className={cn(
          "size-10 rounded-full flex items-center justify-center",
          status === "pending"
            ? "bg-muted"
            : status === "active"
            ? "bg-rupeeflow-teal/20"
            : "bg-rupeeflow-teal"
        )}
      >
        <div
          className={cn(
            "size-6",
            status === "completed"
              ? "text-white"
              : status === "active"
              ? "text-rupeeflow-teal"
              : "text-muted-foreground"
          )}
        >
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <h4
          className={cn(
            "font-medium",
            status === "pending" ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {title}
        </h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const LoadingSpinner = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Shield />,
      title: "Establishing secure connection",
      description: "Creating an encrypted tunnel for data transfer",
    },
    {
      icon: <Server />,
      title: "Fetching transaction data",
      description: "Retrieving your financial data via Account Aggregator",
    },
    {
      icon: <FileJson />,
      title: "Processing transactions",
      description: "Categorizing and analyzing your transactions",
    },
    {
      icon: <CheckCircle2 />,
      title: "Data import complete",
      description: "Successfully imported and processed your transactions",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        let increment = 0.5;

        if (progress < 20) increment = 0.5;
        else if (progress < 60) increment = 0.7;
        else if (progress < 90) increment = 0.8;
        else increment = 1;

        const newProgress = Math.min(progress + increment, 100);
        setProgress(newProgress);

        if (newProgress <= 20) {
          setCurrentStep(0);
        } else if (newProgress <= 60) {
          setCurrentStep(1);
        } else if (newProgress <= 90) {
          setCurrentStep(2);
        } else {
          setCurrentStep(3);
        }

        if (newProgress === 100) {
          setTimeout(() => {
            onComplete();
          }, 1500); // Pause after last step
        }
      }
    }, 120); // Slower interval

    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <div className="bg-teal-100 rounded-full p-3">
            <Shield className="h-6 w-6 text-teal-700" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Account Aggregator Consent
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Securely link your bank accounts to access your financial data
        </p>
      </div>

      {/* Card Section */}
      <Card className="card-gradient p-1">
        <CardHeader>
          <CardTitle className="text-xl text-center">Fetching Your Data</CardTitle>
          <CardDescription className="text-center">
            Please wait while we securely fetch and process your transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{Math.floor(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <Step
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                status={
                  index < currentStep
                    ? "completed"
                    : index === currentStep
                    ? "active"
                    : "pending"
                }
              />
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your data is being processed securely and will only be used as per your consent
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingSpinner;
