import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface GaugeCircleProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    trackColor?: string;
    startAngle?: number;
    sweepAngle?: number;
    lineCap?: 'round' | 'butt' | 'square';
    showLabel?: boolean;
    label?: string;
    sublabel?: string;
    animated?: boolean;
    duration?: number;
    style?: ViewStyle;
}

export default function GaugeCircle({
    value,
    size = 120,
    strokeWidth = 10,
    color = '#1D9E75',
    trackColor = '#e5e5e5',
    startAngle = -90,
    sweepAngle = 360,
    lineCap = 'round',
    showLabel = true,
    label,
    sublabel,
    animated: useAnimation = true,
    duration = 900,
    style,
}: GaugeCircleProps) {
    const r = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;

    // Total arc length based on sweepAngle
    const arcLength = (sweepAngle / 360) * 2 * Math.PI * r;
    // Full circumference for dasharray trick
    const fullCirc = 2 * Math.PI * r;

    console.log("HERE: ", value)
    // offset = how much of the arc is HIDDEN
    const targetOffset = arcLength * (1 - value / 100);

    const animVal = useRef(new Animated.Value(arcLength)).current;

    useEffect(() => {
        if (useAnimation) {

            animVal.setValue(arcLength);

            Animated.timing(animVal, {
                toValue: targetOffset,
                duration,
                useNativeDriver: false,
            }).start();
        } else {
            animVal.setValue(targetOffset);
        }

    }, [targetOffset]);

    // Rotation offset: startAngle corrects the start position
    // SVG circles start at 3 o'clock (0°), so -90° = 12 o'clock
    const rotation = startAngle;

    return (
        <View style={[{ width: size, height: size }, style]}>
            <Svg width={size} height={size}>
                {/* Track arc */}
                <Circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength} ${fullCirc}`}
                    strokeLinecap={lineCap}
                    rotation={rotation}
                    origin={`${cx}, ${cy}`}
                />
                {/* Progress arc */}
                <AnimatedCircle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength} ${fullCirc}`}
                    strokeDashoffset={animVal}
                    strokeLinecap={lineCap}
                    rotation={rotation}
                    origin={`${cx}, ${cy}`}
                />
            </Svg>

            {showLabel && (
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    <View style={styles.labelWrap}>
                        <Text style={styles.labelText}>
                            {label ?? `${Math.round(value)}%`}
                        </Text>
                        {sublabel ? (
                            <Text style={styles.sublabelText}>{sublabel}</Text>
                        ) : null}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    labelWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111',
        fontFamily: 'ebold'
    },
    sublabelText: {
        fontSize: 11,
        color: '#888',
        marginTop: 2,
    },
});