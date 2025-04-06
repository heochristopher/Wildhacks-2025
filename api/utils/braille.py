from typing import Dict

# Mapping for the Latin alphabet (6-bit Braille patterns).
# The patterns represent the six dots (dot1 to dot6) in a Braille cell.
# (These patterns are one common representation; adjust as needed.)
LATIN_TO_BRAILLE: Dict[str, str] = {
    "a": "100000",
    "b": "101000",
    "c": "110000",
    "d": "110100",
    "e": "100100",
    "f": "111000",
    "g": "111100",
    "h": "101100",
    "i": "011000",
    "j": "011100",
    "k": "100010",
    "l": "101010",
    "m": "110010",
    "n": "110110",
    "o": "100110",
    "p": "111010",
    "q": "111110",
    "r": "101110",
    "s": "011010",
    "t": "011110",
    "u": "100011",
    "v": "101011",
    "w": "011101",
    "x": "110011",
    "y": "110111",
    "z": "100111",
}

# Reverse mapping for Latin Braille
BRAILLE_TO_LATIN: Dict[str, str] = {v: k for k, v in LATIN_TO_BRAILLE.items()}

# Placeholder mapping for Korean characters.
# You should replace these with the correct 6-bit patterns for Korean Braille.
KOREAN_TO_BRAILLE: Dict[str, str] = {
    "가": "100000",
    "나": "101000",
    "다": "110000",
    # Add additional mappings here...
}

BRAILLE_TO_KOREAN: Dict[str, str] = {v: k for k, v in KOREAN_TO_BRAILLE.items()}


def encode_character_to_braille(character: str, system: str = "latin") -> str:
    """
    Encodes a given character into an 8-bit Braille binary string.
    The first two bits are "11", and the last 6 bits represent the Braille cell.
    
    Args:
        character: The character to encode.
        system: Either "latin" or "korean" to select the mapping.
        
    Returns:
        An 8-bit string (e.g. "11100000").
        
    Raises:
        ValueError if the character is not in the mapping or system is unsupported.
    """
    if system.lower() == "latin":
        pattern = LATIN_TO_BRAILLE.get(character.lower())
        if pattern is None:
            raise ValueError(f"Character '{character}' not found in Latin Braille mapping.")
        return "11" + pattern
    elif system.lower() == "korean":
        pattern = KOREAN_TO_BRAILLE.get(character)
        if pattern is None:
            raise ValueError(f"Character '{character}' not found in Korean Braille mapping.")
        return "11" + pattern
    else:
        raise ValueError("Unsupported system. Use 'latin' or 'korean'.")


def decode_braille_to_character(braille: str, system: str = "latin") -> str:
    """
    Decodes an 8-bit Braille binary string into the corresponding character.
    The function expects the string to begin with "11" (the fixed padding).
    
    Args:
        braille: The 8-bit binary string (e.g., "11100000").
        system: Either "latin" or "korean" to select the mapping.
        
    Returns:
        The decoded character.
        
    Raises:
        ValueError if the braille string is invalid or pattern not found.
    """
    if not braille.startswith("11") or len(braille) != 8:
        raise ValueError("Invalid braille code: must be 8 bits and start with '11'.")
    
    pattern = braille[2:]  # remove the "11" prefix
    if system.lower() == "latin":
        character = BRAILLE_TO_LATIN.get(pattern)
        if character is None:
            raise ValueError(f"Braille pattern '{pattern}' not found in Latin mapping.")
        return character
    elif system.lower() == "korean":
        character = BRAILLE_TO_KOREAN.get(pattern)
        if character is None:
            raise ValueError(f"Braille pattern '{pattern}' not found in Korean mapping.")
        return character
    else:
        raise ValueError("Unsupported system. Use 'latin' or 'korean'.")
