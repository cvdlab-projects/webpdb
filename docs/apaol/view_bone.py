from chompy import *
from pyplasm import *
from pdbreader import *


## ---input file---------------------------------------------------------------
file_name =  "files/2J5Y.pdb" # sys.argv[1] # "files/2J5Y.pdb" 
input_file = open(file_name, "r")
first_line = input_file.readline()

# --- last term of first line of PDB file --------------------------------------
protein_name = first_line.split()[-1]
print protein_name

## ---sequential processing-----------------------------------------------------
for element in input_file:
        
    #--atom data reading-------------------------------
    if element[0:4] == 'ATOM':
        
        record = decode(element)
        atom, altLoc, residue, domain, number = record[2:7]
        x,y,z = record[8:11]
        #--current residue assembling------------------
        if (number != current_number):
            pypeptide(current_residue,current_number,atoms,current_domain)
            current_number = number
            current_residue = residue
            current_domain = domain
            atoms = [ [x,y,z] ]
        else:
            atoms.append( [x,y,z] )
 
#--append last element in result-----------------------
pypeptide(current_residue,current_number,atoms,domain)


#--create dictionary-----------------------------------
incomplete_peptides = dict(incomplete_peptides)


## ---collect domain polypeptidess---------------------------------------------
Doms = set(domains[1:])


## ---assemble protein domains-------------------------------------------------
polypeptides = [[elem[0] for elem in storage if elem[1] == dom] for dom in Doms]

print polypeptides

## ---assemble main chains (backbones)-----------------------------------------
main_chains = [[elem[2][1] for elem in storage if elem[1] == dom] for dom in Doms]


## ---assemble peptide bonds---------------------------------------------------
chain_bonds = [[(elem[2][0],elem[2][2])
                for elem in storage if elem[1] == dom] for dom in Doms]
peptide_edges = [[[x[i][1], x[i+1][0]] for i in range(len(x)-1)]
                 for x in chain_bonds]


## ---write protein STRUCT(s)---------------------------------------------------

VIEW(STRUCT( map(eval, result[1:]) + lines(peptide_edges[0]) +
                        map(polyline,main_chains)))   


