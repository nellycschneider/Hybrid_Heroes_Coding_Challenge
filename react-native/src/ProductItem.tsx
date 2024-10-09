import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NewIcon from './NewIcon';

interface Product {
    id: string;
    createdTime: string;
    fields: {
        Posted: string;
        "Product Code": string;
        "Product Name": string;
        "Product Image": string;
        "Product Categories": string;
    };
}

interface ProductItemProps {
    product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isNew = Number(new Date()) - Number(new Date(product.fields.Posted)) < 7 * 24 * 60 * 60 * 1000;
    const isLongName = product.fields["Product Name"].length > 10;
    const nameAndDateWidth = isNew && isLongName ? 130 : 160;

    const getDisplayName = (name: string) => {
        if (name.length > 8 && !isExpanded) {
            return `${name.substring(0, 8)}...`;
        }
        return name;
    };

    const getImageSource = () => {
        if (product.fields["Product Image"]) {
            return { uri: product.fields["Product Image"] };
        } else {
            return require('../assets/placeholder_image.png');
        }
    };

    return (
        <View style={styles.productContainer}>
            <Image source={getImageSource()} style={styles.image} />
            <View style={styles.infoContainer}>
                <View style={styles.topInfo}>
                    <View style={[styles.nameAndDateContainer, {width: nameAndDateWidth}]}>
                        <Text style={styles.name}>{getDisplayName(product.fields["Product Name"])}</Text>
                        <Text style={styles.date}>{new Date(product.fields.Posted).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.iconsContainer}>
                        {isNew && <NewIcon/>}
                        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                            <MaterialCommunityIcons style={styles.expandIcon} name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                {isExpanded && (
                    <View style={styles.bottomInfo}>
                        {product.fields["Product Categories"].split(',').map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tag.trim()}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    productContainer: {
        flexDirection: 'row',
        padding: 8,
        marginBottom: 12,
        borderRadius: 4,
        backgroundColor: '#F8F9FC',
        shadowColor: 'rgba(27, 38, 51, 0.25)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 4,
    },
    image: {
        width: 85,
        height: 112,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    topInfo: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    nameAndDateContainer: {
        flexDirection: 'column',
        marginRight: 50,
    },
    iconsContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomInfo: {
        marginTop: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    name: {
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: '900',
        lineHeight: 22,
        textAlign: 'left',
        paddingBottom: 6,
    },
    date: {
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        textAlign: 'left',
    },
    tag: {
        backgroundColor: '#D4E5FF',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 5,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    tagText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 22,
        textAlign: 'left',
    },
    expandIcon: {
        color: '#5E646E',
        marginLeft: 12,
    }
});

export default ProductItem;