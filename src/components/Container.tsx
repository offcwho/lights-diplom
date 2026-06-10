interface Props {
    children: React.ReactNode;
    className?: string;
}


export const Container: React.FC<Props> = ({ children, className }) => {
    return (
        <section
            className={`max-w-7xl mx-auto space-y-16 lg:py-24 md:py-16 sm:py-12 xs:py-8 lg:px-6 md:px-5 sm:px-4 xs:px-4 ${className}`}
        >
            {children}
        </section>
    )
}