import "../../css/modal.css";
import { useEffect, useContext, createContext, ReactNode } from "react";

interface ModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

interface ModalContextType {
    onClose: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        } else {
            document.removeEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    return isOpen ? (
        <div className="react-modal-overlay">
            <div
                className="react-modal-wrapper animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="react-modal-content">
                    <ModalContext.Provider value={{ onClose }}>
                        {children}
                    </ModalContext.Provider>
                </div>
            </div>
        </div>
    ) : null;
};

interface DismissButtonProps {
    children: ReactNode;
    className?: string;
}

const DismissButton = ({ children, className }: DismissButtonProps) => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error("DismissButton must be used within a Modal");
    }

    const { onClose } = context;

    return (
        <button type="button" className={className} onClick={onClose}>
            {children}
        </button>
    );
};

interface ModalSectionProps {
    children: ReactNode;
}

const ModalHeader = ({ children }: ModalSectionProps) => {
    return (
        <div className="react-modal-header flex flex-row justify-between items-center">
            <div className="flex-none w-14 h-14"></div> 
            <div className="react-modal-title">{children}</div>
            <DismissButton className="modal-btn-close font-bold">&times;</DismissButton>
        </div>
    );
};

const ModalBody = ({ children }: ModalSectionProps) => {
    return <div className="react-modal-body">{children}</div>;
};

const ModalFooter = ({ children }: ModalSectionProps) => {
    return <div className="react-modal-footer">{children}</div>;
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.DismissButton = DismissButton;
