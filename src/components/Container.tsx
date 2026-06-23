interface Props {
    children: React.ReactNode;
    className?: string;
}


export const Container: React.FC<Props> = ({ children, className }) => {
    return (
        <section
            className={`max-w-7xl mx-auto space-y-16 lg:py-10 md:py-5 sm:py-2 xs:py-3 lg:px-6 md:px-5 sm:px-4 xs:px-2 ${className}`}
        >
            {children}
        </section>
    )
}