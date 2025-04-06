from typing import Dict

# Mapping for the Latin alphabet (6-bit Braille patterns).
# The patterns represent the six dots (dot1 to dot6) in a Braille cell.
# (These patterns are one common representation; adjust as needed.)


# LATIN_TO_BRAILLE: Dict[str, str] = {
#     "a": "000001",
#     "b": "000101",
#     "c": "000011",
#     "d": "001011",
#     "e": "001001",
#     "f": "000111",
#     "g": "001111",
#     "h": "001101",
#     "i": "000110",
#     "j": "001110",
#     "k": "100001",
#     "l": "100101",
#     "m": "100011",
#     "n": "101011",
#     "o": "101001",
#     "p": "100111",
#     "q": "101111",
#     "r": "101101",
#     "s": "100110",
#     "t": "101110",
#     "u": "110001",
#     "v": "110101",
#     "w": "011110",
#     "x": "110011",
#     "y": "111011",
#     "z": "111001",
# }

LATIN_TO_BRAILLE: Dict[str, str] = {
    "a": "A",
    "b": "E",
    "c": "C",
    "d": "K",
    "e": "I",
    "f": "G",
    "g": "O",
    "h": "M",
    "i": "F",
    "j": "N",
    "k": "a",
    "l": "e",
    "m": "c",
    "n": "k",
    "o": "i",
    "p": "g",
    "q": "o",
    "r": "m",
    "s": "f",
    "t": "n",
    "u": "q",
    "v": "u",
    "w": "^",
    "x": "s",
    "y": "{",
    "z": "y",
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
        return "01" + pattern
    elif system.lower() == "korean":
        pattern = KOREAN_TO_BRAILLE.get(character)
        if pattern is None:
            raise ValueError(f"Character '{character}' not found in Korean Braille mapping.")
        return "01" + pattern
    else:
        raise ValueError("Unsupported system. Use 'latin' or 'korean'.")


def decode_braille_to_character(braille: str, system: str = "latin") -> str:
    """
    Decodes an 8-bit Braille binary string into the corresponding character.
    The function expects the string to begin with "01" (the fixed padding).
    
    Args:
        braille: The 8-bit binary string (e.g., "11100000").
        system: Either "latin" or "korean" to select the mapping.
        
    Returns:
        The decoded character.
        
    Raises:
        ValueError if the braille string is invalid or pattern not found.
    """
    # if not braille.startswith("01") or len(braille) != 8:
    #     raise ValueError("Invalid braille code: must be 8 bits and start with '01'.")
    binary = ord(braille) & 0b00111111  # remove the "01" prefix
    pattern = format(binary, '06b')  # convert to 6-bit binary string
    if system.lower() == "latin":
        character = BRAILLE_TO_LATIN.get(pattern)
        if character is None:
            character = " "
            # raise ValueError(f"Braille pattern '{pattern}' not found in Latin mapping.")
        return character
    elif system.lower() == "korean":
        character = BRAILLE_TO_KOREAN.get(pattern)
        if character is None:
            raise ValueError(f"Braille pattern '{pattern}' not found in Korean mapping.")
        return character
    else:
        raise ValueError("Unsupported system. Use 'latin' or 'korean'.")
