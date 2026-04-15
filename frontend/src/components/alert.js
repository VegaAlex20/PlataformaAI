import { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { 
  CheckCircleIcon,       
  ExclamationIcon,       
  XCircleIcon,           
  InformationCircleIcon,  
  XIcon                  
} from '@heroicons/react/solid'; 

function Alert({ alert }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (alert !== null) {
      setIsVisible(true);
      setIsClosing(false);
      setProgress(100);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(progressInterval);
            handleClose();
            return 0;
          }
          return prev - 2;
        });
      }, 100);
      
      return () => clearInterval(progressInterval);
    }
  }, [alert]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      setProgress(100);
    }, 300);
  };

  const getAlertConfig = (type) => {
    const configs = {
      success: {
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        iconColor: 'text-emerald-500',
        textColor: 'text-emerald-800',
        titleColor: 'text-emerald-900',
        progressColor: 'bg-emerald-500',
        icon: CheckCircleIcon,
        title: '¡Éxito!'
      },
      error: {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-500',
        textColor: 'text-red-800',
        titleColor: 'text-red-900',
        progressColor: 'bg-red-500',
        icon: XCircleIcon,
        title: 'Error'
      },
      warning: {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-500',
        textColor: 'text-yellow-800',
        titleColor: 'text-yellow-900',
        progressColor: 'bg-yellow-500',
        icon: ExclamationIcon,
        title: 'Atención'
      },
      info: {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-500',
        textColor: 'text-blue-800',
        titleColor: 'text-blue-900',
        progressColor: 'bg-blue-500',
        icon: InformationCircleIcon,
        title: 'Información'
      }
    };
    
    return configs[type] || configs.info;
  };

  const displayAlert = () => {
    if (!alert || !isVisible) return null;

    const config = getAlertConfig(alert.alertType);
    const IconComponent = config.icon;

    return (
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none sm:top-4 sm:left-4 sm:right-4">
        <div 
          className={`
            ${config.bgColor} ${config.borderColor} ${config.textColor}
            border-l-4 rounded-lg shadow-lg backdrop-blur-sm
            w-full max-w-md mx-auto pointer-events-auto
            transform transition-all duration-300 ease-in-out
            ${isClosing ? '-translate-y-24 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}
            hover:shadow-xl
          `}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <IconComponent 
                  className={`h-6 w-6 ${config.iconColor}`} 
                  aria-hidden="true" 
                />
              </div>
              <div className="ml-3 flex-1">
                <h3 className={`text-sm font-semibold ${config.titleColor} mb-1`}>
                  {config.title}
                </h3>
                <p className={`text-sm ${config.textColor} leading-relaxed`}>
                  {alert.msg}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={handleClose}
                  className={`
                    inline-flex rounded-md p-1.5 transition-colors duration-200
                    ${config.textColor} hover:bg-white hover:bg-opacity-20
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
                    focus:ring-white focus:ring-opacity-40
                  `}
                  aria-label="Cerrar notificación"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className={`h-1 ${config.bgColor} rounded-b-lg overflow-hidden`}>
            <div 
              className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return <Fragment>{displayAlert()}</Fragment>;
}

const mapStateToProps = state => ({
  alert: state.Alert.alert
});

export default connect(mapStateToProps)(Alert);