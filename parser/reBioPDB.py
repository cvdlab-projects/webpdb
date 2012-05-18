#!/usr/bin/env python
import sys

from Bio.PDB import *
from Bio.Data.IUPACData import atom_weights # Allowed Elements 
from Bio.PDB.PDBIO import _ATOM_FORMAT_STRING
from Bio.PDB.PDBIO import Select

# From BioPython Wiki
class NotDisordered(Select):
    def accept_atom(self, atom):
        return not atom.is_disordered() or atom.get_altloc()=='A'

class NMROutputSelector2( Select ): # Inherit methods from Select class
	def accept_atom( self, atom ):
		if ( not atom.is_disordered() ) or atom.get_altloc() == 'A':
			atom.set_altloc( ' ' ) # Eliminate alt location ID before output.
			return True
		else: # Alt location was not one to be output.
			return False
   
# From Module Bio.PDB.PDBIO
def _get_atom_line(atom, hetfield, segid, atom_number, resname, resseq, icode, chain_id, charge=" "):
	if hetfield!=" ": 
		record_type="HETATM"
	else:
		record_type="ATOM "
	
	if atom.element:
		element = atom.element.strip().upper()
		if element.capitalize() not in atom_weights:
			raise ValueError("ERROR: Unrecognised element %r" % atom.element)
		element = element.rjust(2)
	else:
		element = " "
	name=atom.get_fullname()
	altloc=atom.get_altloc()
	x, y, z=atom.get_coord()
	bfactor=atom.get_bfactor()
	occupancy=atom.get_occupancy()
	args=(record_type, atom_number, name, altloc, resname, chain_id, resseq, icode, x, y, z, occupancy, bfactor, segid, element, charge)
	
	return _ATOM_FORMAT_STRING % args  
	
def _savetoString(structure, select=Select(), write_end=0):
	get_atom_line=_get_atom_line
	str_list = []
	
	if len(structure)>1:
		model_flag=1
	else:
		model_flag=0
		
	for model in structure.get_list():
		# necessary for ENDMDL, do not write ENDMDL if no residues were written for this model
		model_residues_written=0
		atom_number=1
		if model_flag:
			str_list.append("MODEL " + str(model.serial_num) + "\n")
		for chain in model.get_list():
			if not select.accept_chain(chain): 
				continue 		
			chain_id=chain.get_id()
			# necessary for TER do not write TER if no residues were written for this chain 
			chain_residues_written=0 
			for residue in chain.get_unpacked_list():
				if not select.accept_residue(residue): 
					continue 			
				hetfield, resseq, icode=residue.get_id()
				resname=residue.get_resname()
				segid=residue.get_segid()
				for atom in residue.get_unpacked_list():
					if select.accept_atom(atom):
						chain_residues_written=1
						model_residues_written=1 
						s=get_atom_line(atom, hetfield, segid, atom_number, resname, resseq, icode, chain_id)
						str_list.append(s)
						atom_number=atom_number+1
			if chain_residues_written:
				str_list.append("TER\n")
		if model_flag and model_residues_written:
			str_list.append("ENDMDL\n")
		if write_end:
			str_list.append('END\n')
	
	return ''.join(str_list)

def extractPDB(id, path):
	parser = PDBParser(True,True)
	s = parser.get_structure(id, path) # 'my_pdb', 'my_pdb.pdb'
	return [parser.get_header(), s, parser.get_trailer()];

def writePDB(structure, path):
	io = PDBIO()
	io.set_structure(structure)
	io.save(path)	# select=NMROutputSelector2()
	
def stringPDB(structure):
	print _savetoString(structure, select=NMROutputSelector2())

'''
- Need to print header and trailer too
'''

if __name__=="__main__": 
	if len(sys.argv) != 3: 
		print 'ERROR: Usage: %s <id> <path>' % (sys.argv[0]) 
	else:
		dataPDB = extractPDB(sys.argv[1], sys.argv[2]) # '2lgh', 'C:/Android/biopythonTest/pdb2lgh.ent'
		stringPDB(dataPDB[1]) # writePDB(struct, 'C:/Android/biopythonTest/2lgh.pdb')