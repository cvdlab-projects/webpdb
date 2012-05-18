# -*- coding: utf-8 -*-

## This program computes a protein wireframe model from a PDB file.
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
Filter application to generate the wireframe of the first (A) domain of a protein.

Return protein_wireframe.psm, with a polyline named "_protein"
Usage:
> python wireframe.py protein.pdb
"""

import sys,datetime,scipy
from basic import *
from pyplasm import *

result = []
atoms = []
current_number = 0
current_residue = ""
current_domain = ""
storage = []
domain = ""
domains = []
record = []
rec = []
missing_atoms = False
incomplete_peptides = dict()

def decode(element):
    """ To decode the 'ATOM' records of PDB files.

    Return the list of field values of such file element.

    """
    ATOM   = element[0:6].strip()
    serial = element[6:11].strip()
    name = element[12:16].strip()
    altLoc = element[16:17].strip()
    resName = element[17:20].strip()
    chainID = element[21:22].strip()
    resSeq = element[22:26].strip()
    iCode = element[26:27].strip()
    x = element[30:38].strip()
    y = element[38:46].strip()
    z = element[46:54].strip()
    occupancy = element[54:60].strip()
    tempFactor = element[60:66].strip()
    element = element[76:78].strip()
    charge = element[78:80].strip()
    record = [ATOM, serial, name, altLoc, resName, chainID,
              resSeq, iCode, x, y, z, occupancy, tempFactor, element, charge]
    return record

def decode_missing_atoms(element):
    """ To decode the 'REMARK 470' records of PDB files, concerning
    the missing atoms from residues.
    
    Side effect: add a pair in the 'incomplete_peptides' dictionary
    """
    code = element[0:11].strip()
    model = element[11:15].strip()
    residue = element[15:18].strip()
    chain = element[19:20].strip()
    sequence_number = element[20:25].strip()
    insertion_code = element[25:26].strip()
    missing_atoms = element[26:80].split()
    missing_atoms_record = [code, model, residue, chain, sequence_number,
                            insertion_code, missing_atoms]
    incomplete_peptides.update({peptide_name(residue,chain,sequence_number):
                           missing_atoms})

def incomplete_pytopology (residue, name):
    """ To compute the actual topology for a residue with missing atoms.

    """
    full_atoms_indices = range(len(aa_atoms[residue]))
    missing_atoms_indices = \
        [aa_atoms[residue].index(x) for x in incomplete_peptides[name]]
    atoms_indices = set(full_atoms_indices) - set(missing_atoms_indices)
    arcs = [a for a in topology( residue )[0]
            if a[0] in atoms_indices and a[1] in atoms_indices]
    return arcs

def incomplete_topology (residue, name):
    """ To compute the actual topology for a residue with missing atoms.

    """
    full_atoms_indices = range(len(aa_atoms[residue]))
    missing_atoms_indices = \
        [aa_atoms[residue].index(x) for x in incomplete_peptides[name]]
    atoms_indices = set(full_atoms_indices) - set(missing_atoms_indices)
    plasm_indices = [x + 1 for x in atoms_indices]
    arcs = [a for a in topology( residue )[0]
            if a[0] in plasm_indices and a[1] in plasm_indices]
    
    new_topology = [arcs,[[x + 1 for x in range(len(arcs))]]]
    return new_topology

def peptide_name (residue,domain,number):
    """ To compute the actual name of a 'residue' with given sequence 'number'
    within the given 'domain' (chain)

    Return a string. Example: 'GLU_A_0990'

    """
    name = residue + "_" + domain + str("_%.4d" % int(number))
    return name

def pypeptide( residue, number, atoms, domain ):
    """ To assemble the PLaSM DEF of a peptide, as the input for MKPOL.

    Side effects: appended values in 'result', 'storage' and 'domains' data
    structures.
    """
    name = peptide_name (residue,domain,number)

    def cat_atoms (atoms):
        return scipy.matrix(
                map( lambda args: map(eval, args), atoms)
                    ).reshape(1, 3*len(atoms)).tolist()[0]

    if name not in incomplete_peptides:
        peptide_definition = 'Plasm.mkpol( 3, ' \
                   + str(cat_atoms(atoms)) + ', ' \
                   + str(pytopology[ residue ]) + ')'
        result.append( peptide_definition )
    else:
        peptide_definition = 'Plasm.mkpol( 3, ' \
                   + str(cat_atoms(atoms)) + ', ' \
                   + str(incomplete_pytopology( residue, name )) + ' )'
        result.append( peptide_definition )
        
    storage.append( (name, domain, atoms) )
    domains.append( domain )

def peptide( residue, number, atoms, domain, output_type="psm" ):
    """ To assemble the PLaSM DEF of a peptide, as the input for MKPOL.

    Side effects: appended values in 'result', 'storage' and 'domains' data
    structures.
    """
    name = peptide_name (residue,domain,number)
    
    if name not in incomplete_peptides:
        if output_type == "psm":
            peptide_definition = 'DEF ' +  name + ' = ( ' \
                       + printer( atoms ) + ' AL ' \
                       + printer( topology( residue )) + ' );'
        elif output_type == "py":
            peptide_definition = name + ' = AL([ ' \
                       + printer( atoms, output_type ) + ', ' \
                       + printer( topology( residue ), output_type ) + ' ])'
    else:
        if output_type == "psm":
            peptide_definition = 'DEF ' +  name + ' = ( ' \
                       + printer( atoms ) + ' AL ' \
                       + printer( incomplete_topology( residue, name )) + ' );'
        elif output_type == "py":
            peptide_definition = name + ' = AL([ ' \
                       + printer( atoms, output_type ) + ',' \
                       + printer( incomplete_topology( residue, name ), output_type ) + ' ])'
        
    result.append( peptide_definition )
    storage.append( (name, domain, atoms) )
    domains.append( domain )

def topology( residue ):
    """ To produce the PLASM topology of a 'residue'.

    Return a nested list.

    """
    return aa_topology[ residue ]

def read_missing_atoms( element ):
    """ To filter the 'REMARK 470' records (missing atoms) of PDB files.

    Side effect: update global data structure.
    """
    if element[11:15]=="    " and element[15:18] in aa_topology.keys():
        decode_missing_atoms( element )
