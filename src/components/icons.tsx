import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faEyeSlash, 
  faUser, 
  faEnvelope, 
  faPhone,
  faChartLine,
  faRightFromBracket,
  faUserSlash,
  faHome,
  faFileLines,
  faGear,
  faFolderClosed,
  faTrashCan,
  faClock,
  faFileCircleCheck,
  faDesktopAlt,
  faUsers,
  faCode,
  faFolder,
  faSearch,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

interface IconProps {
  className?: string;
  onClick?: () => void;
}
export const IconOlhoAberto = ({ className, onClick }: IconProps) => (
  <FontAwesomeIcon icon={faEye} className={className} onClick={onClick} />
);

export const IconOlhoFechado = ({ className, onClick }: IconProps) => (
  <FontAwesomeIcon icon={faEyeSlash} className={className} onClick={onClick} />
);

export const IconUsuario = ({ className }: IconProps) => (
  <FontAwesomeIcon icon={faUser} className={className} />
);

export const IconEmail = ({ className }: IconProps) => (
  <FontAwesomeIcon icon={faEnvelope} className={className} />
);

export const IconTelefone = ({ className }: IconProps) => (
  <FontAwesomeIcon icon={faPhone} className={className} />
);
export const IconDashbord =({className}:IconProps)=>(
<FontAwesomeIcon icon={faChartLine} className={className}/>
);
export const IconLogout =({className}:IconProps)=>(
<FontAwesomeIcon icon={faRightFromBracket} className={className}/>
);
export const IconTerminarSeccao =({className}:IconProps)=>(
<FontAwesomeIcon icon={faUserSlash} className={className}/>
);
export const IconHome =({className}:IconProps)=>(
<FontAwesomeIcon icon={faHome} className={className}/>
);
export const IconDocumento =({className}:IconProps)=>(
<FontAwesomeIcon icon={faFileLines} className={className}/>
);
export const IconConfig=({className}:IconProps)=>(
<FontAwesomeIcon icon={faGear} className={className}/>
);
export const IconPasta=({className}:IconProps)=>(
<FontAwesomeIcon icon={faFolderClosed} className={className}/>
);
export const IconLixeira=({className}:IconProps)=>(
<FontAwesomeIcon icon={faTrashCan} className={className}/>
);
export const IconBarras=({className}:IconProps)=>(
<FontAwesomeIcon icon={faChartLine} className={className}/>
);
export const IconRelogio=({className}:IconProps)=>(
<FontAwesomeIcon icon={faClock} className={className}/>
);
export const IconAprovado=({className}:IconProps)=>(
<FontAwesomeIcon icon={faFileCircleCheck} className={className}/>
)
export const IconSistemas=({className}:IconProps)=>(
<FontAwesomeIcon icon={faDesktopAlt} className={className}/>
)
export const IconUsuarios=({className}:IconProps)=>(
<FontAwesomeIcon icon={faUsers} className={className}/>
)

export const IconPastaa = ({ className = "w-5 h-5" }: { className?: string }) => (
  <FontAwesomeIcon icon={faFolder} className={className} />
);

export const IconSistema = ({ className = "w-5 h-5" }: { className?: string }) => (
  <FontAwesomeIcon icon={faCode} className={className} />
);

export const IconPesquisa = ({ className = "w-4 h-4" }: { className?: string }) => (
  <FontAwesomeIcon icon={faSearch} className={className} />
);

export const IconVoltar = ({ className = "w-4 h-4" }: { className?: string }) => (
  <FontAwesomeIcon icon={faArrowLeft} className={className} />
);

export const IconVer = ({ className = "w-4 h-4" }: { className?: string }) => (
  <FontAwesomeIcon icon={faEye} className={className} />
);



export  const RepositoryIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
};

export  const  FileIcon= () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 5a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
};


export const CabinetDocsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 "
      viewBox="0 0 512 512"
       fill="currentColor"
      
    >
      <path
        
        d="M414.1 232.1c-4.8 0-9.3 2.1-12.4 5.8l-26 30.8H136.3l-26-30.8c-3.1-3.7-7.6-5.8-12.4-5.8H46.4v178.6h419.2V232.1h-51.5zM308.2 386.3H203.8c-7.9 0-14.3-6.4-14.3-14.3s6.4-14.3 14.3-14.3h104.4c7.9 0 14.3 6.4 14.3 14.3s-6.4 14.3-14.3 14.3z"
      />
      <path
      
        d="M347.1 101.3H164.9c-7.9 0-14.3 6.4-14.3 14.3v102.1h13.2V129.9h181v87.8h13.2V115.6c0-7.9-6.4-14.3-14.3-14.3z"
      />
      <path
        
        d="M369.3 138.4H142.7c-7.9 0-14.3 6.4-14.3 14.3v79.4h13.2V167h214.5v65.1h13.2v-79.4c0-7.9-6.4-14.3-14.3-14.3z"
      />
      <path
        
        d="M391.5 175.5H120.5c-7.9 0-14.3 6.4-14.3 14.3v42.3h13.2V204h258.9v28.1h13.2v-42.3c0-7.9-6.4-14.3-14.3-14.3z"
      />
      <rect x="216" y="153.1" width="80" height="13.2" fill="currentColor" />
      <rect x="216" y="189" width="48" height="13.2" fill="currentColor" />
      <rect x="216" y="225" width="80" height="13.2" fill="currentColor" />
    </svg>
  );
};
export const CameraIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 " 
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
    
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      <path d="m14 14-2.586-2.586a2 2 0 0 0-2.828 0L3 20" />
    </svg>
  );
};