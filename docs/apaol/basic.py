# -*- coding: utf-8 -*-

## This module provides basic data and operations for amino acid processing.
## Author: Alberto Paoluzzi (paoluzzi@dia.uniroma3.it)
## Copyright (C) 2009 Dipartimento Informatica e Automazione,
## Università Roma Tre, Rome, Italy.

## This library is free software; you can redistribute it and/or
## modify it under the terms of the GNU Lesser General Public
## License as published by the Free Software Foundation; either
## version 2.1 of the License, or (at your option) any later version.

## This library is distributed in the hope that it will be useful,
## but WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
## Lesser General Public License for more details.

## You should have received a copy of the GNU Lesser General Public
## License along with this library; if not, write to the Free Software
## Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

"""
Basic data and operations with amino acids and other bio molecules.
"""
from numpy import array, reshape, transpose
import scipy
from pyplasm import *


def __evalprint__(string):
    print string + " => ", eval(string)


atomic_mass = {
    'CA': 12.01115, # is C_alpha, not Calcium
    'C': 12.01115,
    'N': 14.0067,
    'P': 30.9738,
    'S': 32.064,
    'O': 15.9994,
    'H': 1.00797
    }

if __name__ == "__main__":
    print "\n## --Generate atomic masses----------------------------"
    __evalprint__(""" atomic_mass['CA'] # C_alpha""")
    __evalprint__(""" atomic_mass['O'] """)



aacode = {
    'Alanine' : ( 'A', 'Ala' ),
    'Arginine' : ( 'R', 'Arg' ),
    'Asparagine' : ( 'N', 'Asn' ),
    'AsparticAcid' : ( 'D', 'Asp' ),
    'Cysteine' : ( 'C', 'Cys' ),
    'Glutamine' : ( 'Q', 'Gln' ),
    'GlutamicAcid' : ( 'E', 'Glu' ),
    'Glycine' : ( 'G', 'Gly' ),
    'Histidine' : ( 'H', 'His' ),
    'Isoleucine' : ( 'I', 'Ile' ),
    'Leucine' : ( 'L', 'Leu' ),
    'Lysine' : ( 'K', 'Lys' ),
    'Methionine' : ( 'M', 'Met' ),
    'Phenylalanine' : ( 'F', 'Phe' ),
    'Proline' : ( 'P', 'Pro' ),
    'Serine' : ( 'S', 'Ser' ),
    'Threonine' : ( 'T', 'Thr' ),
    'Tryptophan' : ( 'W', 'Trp' ),
    'Tyrosine' : ( 'Y', 'Tyr' ),
    'Valine' : ( 'V', 'Val' )
}

if __name__ == "__main__":
    print "\n## --Generate Amino acid codes----------------------------"
    __evalprint__(""" aacode['Tyrosine'][0] """)
    __evalprint__(""" aacode['Tyrosine'][1] """)



aacid = {
    'A' : 'Alanine',
    'R' : 'Arginine',
    'N' : 'Asparagine',
    'D' : 'AsparticAcid',
    'C' : 'Cysteine',
    'Q' : 'Glutamine',
    'E' : 'GlutamicAcid',
    'G' : 'Glycine',
    'H' : 'Histidine',
    'I' : 'Isoleucine',
    'L' : 'Leucine',
    'K' : 'Lysine',
    'M' : 'Methionine',
    'F' : 'Phenylalanine',
    'P' : 'Proline',
    'S' : 'Serine',
    'T' : 'Threonine',
    'W' : 'Tryptophan',
    'Y' : 'Tyrosine',
    'V' : 'Valine'
}

if __name__ == "__main__":
    print "\n## --Amino acid names from short codes----------------------------"
    __evalprint__(""" aacid['T'] """)
    __evalprint__(""" aacid['F'] """)
    __evalprint__(""" aacid['W'] """)



aminoacid = {
    'Ala' : 'Alanine',
    'Arg' : 'Arginine',
    'Asn' : 'Asparagine',
    'Asp' : 'AsparticAcid',
    'Cys' : 'Cysteine',
    'Gln' : 'Glutamine',
    'Glu' : 'GlutamicAcid',
    'Gly' : 'Glycine',
    'His' : 'Histidine',
    'Ile' : 'Isoleucine',
    'Leu' : 'Leucine',
    'Lys' : 'Lysine',
    'Met' : 'Methionine',
    'Phe' : 'Phenylalanine',
    'Pro' : 'Proline',
    'Ser' : 'Serine',
    'Thr' : 'Threonine',
    'Trp' : 'Tryptophan',
    'Tyr' : 'Tyrosine',
    'Val' : 'Valine'
}

if __name__ == "__main__":
    print "\n## --Amino acid names from long codes----------------------------"
    __evalprint__(""" aminoacid['Gly'] """)
    __evalprint__(""" aminoacid['Met'] """)
    __evalprint__(""" aminoacid['Tyr'] """)



compound = {
    'Alanine' : ['C',3,'H',7,'N',1,'O',2],
    'Arginine' : ['C',6,'H',14,'N',4,'O',2],
    'Asparagine' : ['C',4,'H',8,'N',2,'O',3],
    'AsparticAcid' : ['C',4,'H',7,'N',1,'O',4],
    'Cysteine' : ['C',3,'H',7,'N',1,'O',2,'S',1],
    'GlutamicAcid' : ['C',5,'H',9,'N',1,'O',4],
    'Glutamine' : ['C',5,'H',10,'N',2,'O',3],
    'Glycine' : ['C',2,'H',5,'N',1,'O',2],
    'Histidine' : ['C',6,'H',9,'N',3,'O',2],
    'Isoleucine' : ['C',6,'H',13,'N',1,'O',2],
    'Leucine' : ['C',6,'H',13,'N',1,'O',2],
    'Lysine' : ['C',6,'H',14,'N',2,'O',2],
    'Methionine' : ['C',5,'H',11,'N',1,'O',2,'S',1],
    'Phenylalanine' : ['C',9,'H',11,'N',1,'O',2],
    'Proline' : ['C',5,'H',9,'N',1,'O',2],
    'Serine' : ['C',3,'H',7,'N',1,'O',3],
    'Threonine' : ['C',4,'H',9,'N',1,'O',3],
    'Tryptophan' : ['C',11,'H',12,'N',2,'O',2],
    'Tyrosine' : ['C',9,'H',11,'N',1,'O',3],
    'Valine' : ['C',5,'H',11,'N',1,'O',1],
    'Water' : ['H',2,'O',1]
    }


if __name__ == "__main__":
    print "\n## --Chemical formula of a compound----------------------------"
    __evalprint__(""" compound['GlutamicAcid'] """)
    __evalprint__(""" compound['Histidine'] """)
    __evalprint__(""" compound['Water'] """)



Van_der_Waals_Radius = { # Angstroms
    'Carbon': 1.70,
    'Chlorine': 1.75,
    'Copper': 1.4,
    'Fluorine' : 1.47,
    'Hydrogen': 1.20,
    'Nitrogen': 1.55,
    'Oxygen': 1.52,
    'Phosphorus': 1.80,
    'Sulfur': 1.80
}


if __name__ == "__main__":
    print "\n## --Van der Waals radius of atoms----------------------------"
    __evalprint__(""" Van_der_Waals_Radius['Carbon'] """)
    __evalprint__(""" Van_der_Waals_Radius['Nitrogen'] """)
    __evalprint__(""" Van_der_Waals_Radius['Oxygen'] """)



aa_atoms = {    # PDB coding
    'ALA' : ['N','CA','C','O','CB'],
    'ARG' : ['N','CA','C','O','CB','CG','CD','NE','CZ','NH1','NH2'],
    'ASN' : ['N','CA','C','O','CB','CG','OD1','ND2'],
    'ASP' : ['N','CA','C','O','CB','CG','OD1','OD2'],
    'CYS' : ['N','CA','C','O','CB','SG'],
    'GLN' : ['N','CA','C','O','CB','CG','CD','OE1','NE2'],
    'GLU' : ['N','CA','C','O','CB','CG','CD','OE1','OE2'],
    'GLY' : ['N','CA','C','O'],
    'HIS' : ['N','CA','C','O','CB','CG','ND1','CD2','CE1','NE2'],
    'ILE' : ['N','CA','C','O','CB','CG1','CG2','CD1'],
    'LEU' : ['N','CA','C','O','CB','CG','CD1','CD2'],
    'LYS' : ['N','CA','C','O','CB','CG','CD','CE','NZ'],
    'MET' : ['N','CA','C','O','CB','CG','SD','CE'],
    'PHE' : ['N','CA','C','O','CB','CG','CD1','CD2','CE1','CE2','CZ'],
    'PRO' : ['N','CA','C','O','CB','CG','CD'],
    'SER' : ['N','CA','C','O','CB','OG'],
    'THR' : ['N','CA','C','O','CB','OG1','CG2'],
    'TRP' : ['N','CA','C','O','CB','CG','CD1','CD2','NE1','CE2','CE3','CZ2','CZ3','CH2'],
    'TYR' : ['N','CA','C','O','CB','CG','CD1','CD2','CE1','CE2','CZ','OH'],
    'VAL' : ['N','CA','C','O','CB','CG1','CG2'],
}


if __name__ == "__main__":
    print "\n## --Atom list of amino acids (PDB coding)-------------------"
    __evalprint__(""" aa_atoms['ALA'] """)
    __evalprint__(""" aa_atoms['CYS'] """)
    __evalprint__(""" aa_atoms['THR'] """)



##aa_topology = { # PDB -> PLASM coding
##    'ALA' : '<<1,2>,<2,3>,<3,4>,<2,5>>,<1..4>',
##    'ARG' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<7,8>,<8,9>,<9,10>,<9,11>>,<1..10>',
##    'ASN' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<6,8>>,<1..7>',
##    'ASP' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<6,8>>,<1..7>',
##    'CYS' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>>,<1..5>',
##    'GLN' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<7,8>,<7,9>>,<1..8>',
##    'GLU' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<7,8>,<7,9>>,<1..8>',
##    'GLY' : '<<1,2>,<2,3>,<3,4>>,<1..3>',
##    'HIS' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<6,8>,<7,9>,<9,10>,<8,10>>,<1..10>',
##    'ILE' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<5,7>,<7,8>>,<1..7>',
##    'LEU' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<6,8>>,<1..7>',
##    'LYS' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<7,8>,<8,9>>,<1..8>',
##    'MET' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<7,8>>,<1..7>',
##    'PHE' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<6,8>,<7,9>,<8,10>,<9,11>,<10,11>>,<1..11>',
##    'PRO' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<7,1>>,<1..7>',
##    'SER' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>>,<1..5>',
##    'THR' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<5,7>>,<1..6>',
##    'TRP' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<6,8>,<7,9>,<9,10>,<8,10>,<8,11>,<10,12>,<11,13>,<12,14>,<13,14>>,<1..15>',
##    'TYR' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<6,7>,<6,8>,<7,9>,<8,10>,<9,11>,<10,11>,<11,12>>,<1..12>',
##    'VAL' : '<<1,2>,<2,3>,<3,4>,<2,5>,<5,6>,<5,7>>,<1..6>',
##    ''  : ''
##}

aa_topology = { # PDB -] PLASM coding
    'ALA' : [[[1,2],[2,3],[3,4],[2,5]],[[1,2,3,4]]],
    'ARG' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[7,8],[8,9],[9,10],[9,11]],[[1,2,3,4,5,6,7,8,9,10]]],
    'ASN' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[6,8]],[[1,2,3,4,5,6,7]]],
    'ASP' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[6,8]],[[1,2,3,4,5,6,7]]],
    'CYS' : [[[1,2],[2,3],[3,4],[2,5],[5,6]],[[1,2,3,4,5]]],
    'GLN' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[7,8],[7,9]],[[1,2,3,4,5,6,7,8]]],
    'GLU' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[7,8],[7,9]],[[1,2,3,4,5,6,7,8]]],
    'GLY' : [[[1,2],[2,3],[3,4]],[[1,2,3]]],
    'HIS' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[6,8],[7,9],[9,10],[8,10]],[[1,2,3,4,5,6,7,8,9,10]]],
    'ILE' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[5,7],[7,8]],[[1,2,3,4,5,6,7]]],
    'LEU' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[6,8]],[[1,2,3,4,5,6,7]]],
    'LYS' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[7,8],[8,9]],[[1,2,3,4,5,6,7,8]]],
    'MET' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[7,8]],[[1,2,3,4,5,6,7]]],
    'PHE' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[6,8],[7,9],[8,10],[9,11],[10,11]],[[1,2,3,4,5,6,7,8,9,10,11]]],
    'PRO' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[7,1]],[[1,2,3,4,5,6,7]]],
    'SER' : [[[1,2],[2,3],[3,4],[2,5],[5,6]],[[1,2,3,4,5]]],
    'THR' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[5,7]],[[1,2,3,4,5,6]]],
    'TRP' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[6,8],[7,9],[9,10],[8,10],[8,11],[10,12],[11,13],[12,14],[13,14]],[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]]],
    'TYR' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[6,8],[7,9],[8,10],[9,11],[10,11],[11,12]],[[1,2,3,4,5,6,7,8,9,10,11,12]]],
    'VAL' : [[[1,2],[2,3],[3,4],[2,5],[5,6],[5,7]],[[1,2,3,4,5,6]]],
    ''  : ''
}

pytopology = { # PDB -> PLASM coding
    '': '',
    'ALA': [[0, 1], [1, 2], [2, 3], [1, 4]],
    'ARG': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [8, 10]],
    'ASN': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [5, 7]],
    'ASP': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [5, 7]],
    'CYS': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5]],
    'GLN': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [6, 7], [6, 8]],
    'GLU': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [6, 7], [6, 8]],
    'GLY': [[0, 1], [1, 2], [2, 3]],
    'HIS': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [5, 7], [6, 8], [8, 9], [7, 9]],
    'ILE': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [4, 6], [6, 7]],
    'LEU': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [5, 7]],
    'LYS': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [6, 7], [7, 8]],
    'MET': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [6, 7]],
    'PHE': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [5, 7], [6, 8], [7, 9], [8, 10], [9, 10]],
    'PRO': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [6, 0]],
    'SER': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5]],
    'THR': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [4, 6]],
    'TRP': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [5, 7], [6, 8], [8, 9], [7, 9], [7, 10], [9, 11], [10, 12], [11, 13], [12, 13]],
    'TYR': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [5, 7], [6, 8], [7, 9], [8, 10], [9, 10], [10, 11]],
    'VAL': [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [4, 6]]
}


if __name__ == "__main__":
    print "\n## --Amino acid topology (within polypeptides; PDB -> PLASM coding)-----"
    __evalprint__(""" aa_topology['ALA'] """)
    __evalprint__(""" aa_topology['CYS'] """)
    __evalprint__(""" aa_topology['THR'] """)




def formula (molecule):
    """ gives the formula of a chemical compound as a 2xn array.


    Return in the 1-st row the chemical simbols of elements as strings, and
    in the 2-nd row the corresponing number of atoms.
    The 'molecule' arg must be a list as returned from the 'compound' dictionary.
    """
    return array(molecule).reshape(len(molecule)/2,2).transpose()


if __name__ == "__main__":
    print "\n## --Formula of a chemical compound as a 2xn array-----------------"
    __evalprint__(""" formula( compound['Threonine'] ) """)
    __evalprint__(""" formula( compound['GlutamicAcid'] ) """)
    __evalprint__(""" formula( compound['Methionine'] ) """)




def molar_mass (molecule):
    """ computes the mass of one mole of a chemical compound.

    Return the linear combination of the measures of mass of component atoms,
    times the numbers of their instances in the compound.
    The 'molecule' string must be a key of the 'compound' dictionary.
    """
    def mass (atom):
        return atomic_mass[atom]

    masses = array(map(mass, formula(molecule)[0].tolist()))
    numbers = formula(molecule)[1].astype(int)
    return sum(masses * numbers)


if __name__ == "__main__":
    print "\n## --Mass of a mole of a chemical compound---------------------"
    __evalprint__(""" molar_mass ( compound['Threonine'] ) """)
    __evalprint__(""" molar_mass ( compound['GlutamicAcid'] ) """)
    __evalprint__(""" molar_mass ( compound['Methionine'] ) """)




def bound_mass(molecule_name):
    """ return the molar mass of the aminoacid, minus a molecule of water,
    i.e. its mass within the backbone of a protein.

    The 'molecule_name' string must be a key of the 'compound' dictionary.
    """
    return (molar_mass(compound[molecule_name]) - molar_mass(compound['Water']))


if __name__ == "__main__":
    print "\n## --Mass of an amino acid in a polypeptide-----------------"
    __evalprint__(""" bound_mass('Threonine') """)
    __evalprint__(""" bound_mass('GlutamicAcid') """)
    __evalprint__(""" bound_mass('Methionine') """)




def one (list_of_strings):
    """To catenate a flat list of strings.

    Return a single string in plasm format.
    """
    return '<' + ', '.join(list_of_strings) + '>'

def two (list_of_strings):
    """To catenate a flat list of strings.

    Return a single string in plasm format.
    """
    return '[' + ', '.join(list_of_strings) + ']'


if __name__ == "__main__":
    print "\n## --Catenate a flat list of str in plasm format -----------------"
    __evalprint__(""" one(['1','2','3','4']) """)
    __evalprint__(""" one(['A','aaa','ABC','234']) """)




def printer (args, output="psm"):
    """ To make an 'internal printing' of a (possibly nested) list in plasm format.

    Return a string, with square brackets substituted by angle brackets
    """
    if output == "psm":
        if isinstance(args, list):
#            return one(map(printer, args))
            return one([printer(arg, output) for arg in args])
        else:
            return str(args)
    elif output == "py":
        if isinstance(args, list):
#            return two(map(printer, args))
            return two([printer(arg, output) for arg in args])
        else:
            return str(args)


if __name__ == "__main__":
    print "\n## --Catenate a (possibly nested) list (str & num) in plasm format--"
    __evalprint__(""" printer(['1','2','3','4']) """)
    __evalprint__(""" printer(['N',1,['C','O',2],'O',2,['C','O',['C','O',2]],'CD1',3]) """)
    __evalprint__(""" printer(['O',2,['C',['C','O',678.912]],'CD123',123]) """)



def cat_atoms (atoms):
    return scipy.matrix(
            map( lambda args: map(eval, args), atoms)
                ).reshape(1, 3*len(atoms)).tolist()[0]

def lines(pointpairs):
    return map(lambda pair: Plasm.mkpol(3,pair,[[0,1]]),
               map(cat_atoms, pointpairs))


def polyline(points):
    n = len(points)
    d = len(points[0])
    print "d,n = ", d,n
    return Plasm.mkpol(d,cat_atoms(points),zip(range(n-1),range(1,n)))

