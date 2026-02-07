'use client';
import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

// Interface for the props of each individual icon.
interface IconProps {
    id: number;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    className: string;
}

// Interface for the main component's props.
export interface FloatingIconsProps {
    icons: IconProps[];
    className?: string;
}

// A single icon component with its own motion logic
const Icon = ({
    mouseX,
    mouseY,
    iconData,
    index,
}: {
    mouseX: React.MutableRefObject<number>;
    mouseY: React.MutableRefObject<number>;
    iconData: IconProps;
    index: number;
}) => {
    const ref = React.useRef<HTMLDivElement>(null);

    // Use index-based duration for stable, deterministic animation
    const animationDuration = 6 + (index % 5);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 25 });
    const springY = useSpring(y, { stiffness: 200, damping: 25 });

    React.useEffect(() => {
        const handleMouseMove = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const distance = Math.sqrt(
                    Math.pow(mouseX.current - (rect.left + rect.width / 2), 2) +
                    Math.pow(mouseY.current - (rect.top + rect.height / 2), 2)
                );

                if (distance < 120) {
                    const angle = Math.atan2(
                        mouseY.current - (rect.top + rect.height / 2),
                        mouseX.current - (rect.left + rect.width / 2)
                    );
                    const force = (1 - distance / 120) * 35;
                    x.set(-Math.cos(angle) * force);
                    y.set(-Math.sin(angle) * force);
                } else {
                    x.set(0);
                    y.set(0);
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [x, y, mouseX, mouseY]);

    return (
        <motion.div
            ref={ref}
            key={iconData.id}
            style={{
                x: springX,
                y: springY,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{
                delay: index * 0.1,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={cn('absolute', iconData.className)}
        >
            <motion.div
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 p-2.5 rounded-xl bg-slate-900/70 backdrop-blur-sm border border-white/10 shadow-lg"
                animate={{
                    y: [0, -6, 0, 6, 0],
                    x: [0, 4, 0, -4, 0],
                    rotate: [0, 3, 0, -3, 0],
                }}
                transition={{
                    duration: animationDuration,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                }}
                whileHover={{
                    opacity: 1,
                    scale: 1.15,
                    transition: { duration: 0.2 }
                }}
            >
                <iconData.icon className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>
        </motion.div>
    );
};

const FloatingIcons = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & FloatingIconsProps
>(({ className, icons, ...props }, ref) => {
    const mouseX = React.useRef(0);
    const mouseY = React.useRef(0);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        mouseX.current = event.clientX;
        mouseY.current = event.clientY;
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            className={cn(
                'absolute inset-0 w-full h-full overflow-hidden pointer-events-auto',
                className
            )}
            {...props}
        >
            {icons.map((iconData, index) => (
                <Icon
                    key={iconData.id}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    iconData={iconData}
                    index={index}
                />
            ))}
        </div>
    );
});

FloatingIcons.displayName = 'FloatingIcons';

export { FloatingIcons };
