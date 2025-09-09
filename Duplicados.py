import os
import hashlib
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from pathlib import Path
import threading
from collections import defaultdict
import mimetypes


class BookDuplicateDetector:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Detector de Libros Duplicados")
        self.root.geometry("900x700")
        self.root.configure(bg='#f0f0f0')

        # Extensiones de libros electrónicos comunes
        self.book_extensions = {
            '.pdf', '.epub', '.mobi', '.azw', '.azw3', '.djvu',
            '.fb2', '.lit', '.pdb', '.txt', '.rtf', '.doc', '.docx'
        }

        self.duplicates = defaultdict(list)
        self.total_files = 0
        self.processed_files = 0

        self.setup_ui()

    def setup_ui(self):
        # Título
        title_frame = tk.Frame(self.root, bg='#2c3e50', height=80)
        title_frame.pack(fill='x', padx=10, pady=10)
        title_frame.pack_propagate(False)

        title_label = tk.Label(
            title_frame,
            text="📚 Detector de Libros Duplicados",
            font=('Arial', 20, 'bold'),
            fg='white',
            bg='#2c3e50'
        )
        title_label.pack(expand=True)

        # Frame para selección de carpeta
        folder_frame = tk.Frame(self.root, bg='#f0f0f0')
        folder_frame.pack(fill='x', padx=20, pady=10)

        tk.Label(
            folder_frame,
            text="Carpeta a analizar:",
            font=('Arial', 12, 'bold'),
            bg='#f0f0f0'
        ).pack(anchor='w')

        path_frame = tk.Frame(folder_frame, bg='#f0f0f0')
        path_frame.pack(fill='x', pady=5)

        self.path_var = tk.StringVar()
        self.path_entry = tk.Entry(
            path_frame,
            textvariable=self.path_var,
            font=('Arial', 10),
            width=60
        )
        self.path_entry.pack(side='left', fill='x', expand=True, padx=(0, 10))

        browse_btn = tk.Button(
            path_frame,
            text="Examinar",
            command=self.browse_folder,
            bg='#3498db',
            fg='white',
            font=('Arial', 10, 'bold'),
            cursor='hand2'
        )
        browse_btn.pack(side='right')

        # Opciones de análisis
        options_frame = tk.LabelFrame(
            self.root,
            text="Opciones de Análisis",
            font=('Arial', 11, 'bold'),
            bg='#f0f0f0',
            padx=10,
            pady=10
        )
        options_frame.pack(fill='x', padx=20, pady=10)

        self.analyze_by_name = tk.BooleanVar(value=True)
        self.analyze_by_size = tk.BooleanVar(value=True)
        self.analyze_by_hash = tk.BooleanVar(value=False)
        self.include_subfolders = tk.BooleanVar(value=True)

        tk.Checkbutton(
            options_frame,
            text="Comparar por nombre (similar)",
            variable=self.analyze_by_name,
            bg='#f0f0f0',
            font=('Arial', 10)
        ).grid(row=0, column=0, sticky='w', padx=10)

        tk.Checkbutton(
            options_frame,
            text="Comparar por tamaño",
            variable=self.analyze_by_size,
            bg='#f0f0f0',
            font=('Arial', 10)
        ).grid(row=0, column=1, sticky='w', padx=10)

        tk.Checkbutton(
            options_frame,
            text="Comparar por contenido (hash)",
            variable=self.analyze_by_hash,
            bg='#f0f0f0',
            font=('Arial', 10)
        ).grid(row=1, column=0, sticky='w', padx=10)

        tk.Checkbutton(
            options_frame,
            text="Incluir subcarpetas",
            variable=self.include_subfolders,
            bg='#f0f0f0',
            font=('Arial', 10)
        ).grid(row=1, column=1, sticky='w', padx=10)

        # Botón de análisis
        analyze_btn = tk.Button(
            self.root,
            text="🔍 Analizar Duplicados",
            command=self.start_analysis,
            bg='#27ae60',
            fg='white',
            font=('Arial', 14, 'bold'),
            cursor='hand2',
            height=2
        )
        analyze_btn.pack(pady=20)

        # Barra de progreso
        self.progress_var = tk.DoubleVar()
        self.progress = ttk.Progressbar(
            self.root,
            variable=self.progress_var,
            maximum=100,
            length=400
        )

        self.status_label = tk.Label(
            self.root,
            text="Listo para analizar",
            font=('Arial', 10),
            bg='#f0f0f0'
        )

        # Resultados
        results_frame = tk.Frame(self.root, bg='#f0f0f0')
        results_frame.pack(fill='both', expand=True, padx=20, pady=(0, 20))

        tk.Label(
            results_frame,
            text="Resultados:",
            font=('Arial', 12, 'bold'),
            bg='#f0f0f0'
        ).pack(anchor='w')

        # Treeview para mostrar duplicados
        tree_frame = tk.Frame(results_frame)
        tree_frame.pack(fill='both', expand=True, pady=10)

        columns = ('Archivo', 'Ruta', 'Tamaño', 'Tipo')
        self.tree = ttk.Treeview(tree_frame, columns=columns, show='tree headings')

        # Configurar columnas
        self.tree.heading('#0', text='Grupo')
        self.tree.heading('Archivo', text='Nombre del Archivo')
        self.tree.heading('Ruta', text='Ubicación')
        self.tree.heading('Tamaño', text='Tamaño')
        self.tree.heading('Tipo', text='Tipo')

        self.tree.column('#0', width=100)
        self.tree.column('Archivo', width=250)
        self.tree.column('Ruta', width=300)
        self.tree.column('Tamaño', width=100)
        self.tree.column('Tipo', width=80)

        # Scrollbars
        v_scrollbar = ttk.Scrollbar(tree_frame, orient='vertical', command=self.tree.yview)
        h_scrollbar = ttk.Scrollbar(tree_frame, orient='horizontal', command=self.tree.xview)
        self.tree.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)

        self.tree.grid(row=0, column=0, sticky='nsew')
        v_scrollbar.grid(row=0, column=1, sticky='ns')
        h_scrollbar.grid(row=1, column=0, sticky='ew')

        tree_frame.grid_rowconfigure(0, weight=1)
        tree_frame.grid_columnconfigure(0, weight=1)

        # Menú contextual
        self.context_menu = tk.Menu(self.root, tearoff=0)
        self.context_menu.add_command(label="Abrir archivo", command=self.open_file)
        self.context_menu.add_command(label="Mostrar en explorador", command=self.show_in_explorer)
        self.context_menu.add_separator()
        self.context_menu.add_command(label="Eliminar archivo", command=self.delete_file)

        self.tree.bind("<Button-3>", self.show_context_menu)

        # Estadísticas
        self.stats_label = tk.Label(
            results_frame,
            text="",
            font=('Arial', 10),
            bg='#f0f0f0',
            fg='#2c3e50'
        )
        self.stats_label.pack(pady=5)

    def browse_folder(self):
        folder = filedialog.askdirectory()
        if folder:
            self.path_var.set(folder)

    def start_analysis(self):
        if not self.path_var.get():
            messagebox.showerror("Error", "Por favor selecciona una carpeta")
            return

        if not os.path.exists(self.path_var.get()):
            messagebox.showerror("Error", "La carpeta seleccionada no existe")
            return

        # Limpiar resultados anteriores
        self.tree.delete(*self.tree.get_children())
        self.duplicates.clear()

        # Mostrar barra de progreso
        self.progress.pack(pady=10)
        self.status_label.pack()

        # Ejecutar análisis en hilo separado
        thread = threading.Thread(target=self.analyze_folder, daemon=True)
        thread.start()

    def analyze_folder(self):
        try:
            folder_path = self.path_var.get()

            # Contar archivos totales
            self.status_label.config(text="Contando archivos...")
            self.count_files(folder_path)

            # Analizar archivos
            self.status_label.config(text="Analizando archivos...")
            self.processed_files = 0
            self.scan_files(folder_path)

            # Mostrar resultados
            self.root.after(0, self.show_results)

        except Exception as e:
            self.root.after(0, lambda: messagebox.showerror("Error", f"Error durante el análisis: {str(e)}"))
        finally:
            self.root.after(0, self.hide_progress)

    def count_files(self, folder_path):
        self.total_files = 0
        for root, dirs, files in os.walk(folder_path):
            if not self.include_subfolders.get() and root != folder_path:
                continue
            for file in files:
                if Path(file).suffix.lower() in self.book_extensions:
                    self.total_files += 1

    def scan_files(self, folder_path):
        file_info = {}

        for root, dirs, files in os.walk(folder_path):
            if not self.include_subfolders.get() and root != folder_path:
                continue

            for file in files:
                file_path = os.path.join(root, file)
                file_ext = Path(file).suffix.lower()

                if file_ext in self.book_extensions:
                    self.processed_files += 1
                    progress = (self.processed_files / self.total_files) * 100
                    self.root.after(0, lambda p=progress: self.progress_var.set(p))
                    self.root.after(0, lambda: self.status_label.config(
                        text=f"Procesando: {self.processed_files}/{self.total_files} archivos"
                    ))

                    try:
                        stat_info = os.stat(file_path)
                        file_size = stat_info.st_size

                        # Crear clave para identificar duplicados
                        duplicate_key = self.create_duplicate_key(file, file_path, file_size)

                        if duplicate_key:
                            file_info[file_path] = {
                                'name': file,
                                'size': file_size,
                                'path': file_path,
                                'key': duplicate_key
                            }
                    except Exception as e:
                        print(f"Error procesando {file_path}: {e}")

        # Agrupar duplicados
        key_groups = defaultdict(list)
        for file_path, info in file_info.items():
            key_groups[info['key']].append(info)

        # Filtrar solo grupos con más de un archivo
        for key, files in key_groups.items():
            if len(files) > 1:
                self.duplicates[key] = files

    def create_duplicate_key(self, filename, file_path, file_size):
        key_parts = []

        if self.analyze_by_name.get():
            # Normalizar nombre (sin extensión, minúsculas, sin espacios extra)
            name_part = Path(filename).stem.lower().strip()
            name_part = ' '.join(name_part.split())  # Normalizar espacios
            key_parts.append(f"name:{name_part}")

        if self.analyze_by_size.get():
            key_parts.append(f"size:{file_size}")

        if self.analyze_by_hash.get():
            try:
                hash_md5 = self.calculate_file_hash(file_path)
                key_parts.append(f"hash:{hash_md5}")
            except:
                pass  # Si no se puede calcular el hash, continuar sin él

        return '|'.join(key_parts) if key_parts else None

    def calculate_file_hash(self, file_path):
        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            # Leer solo los primeros 64KB para archivos grandes
            chunk = f.read(65536)
            if chunk:
                hash_md5.update(chunk)
        return hash_md5.hexdigest()

    def show_results(self):
        if not self.duplicates:
            self.stats_label.config(text="🎉 ¡No se encontraron libros duplicados!")
            return

        group_num = 1
        total_duplicates = 0
        total_wasted_space = 0

        for key, files in self.duplicates.items():
            # Crear grupo padre
            group_id = self.tree.insert('', 'end', text=f'Grupo {group_num}', open=True)

            # Añadir archivos del grupo
            largest_file = max(files, key=lambda x: x['size'])
            for file_info in files:
                size_str = self.format_file_size(file_info['size'])

                # Marcar el archivo más grande
                display_name = file_info['name']
                if file_info == largest_file:
                    display_name += " (original recomendado)"

                self.tree.insert(group_id, 'end',
                                 values=(display_name, file_info['path'], size_str,
                                         Path(file_info['name']).suffix.upper()))

            total_duplicates += len(files) - 1  # -1 porque uno es el original
            # Espacio desperdiciado = tamaño * (cantidad de duplicados - 1)
            total_wasted_space += largest_file['size'] * (len(files) - 1)
            group_num += 1

        # Mostrar estadísticas
        wasted_space_str = self.format_file_size(total_wasted_space)
        stats_text = (f"📊 Encontrados {len(self.duplicates)} grupos de duplicados | "
                      f"{total_duplicates} archivos duplicados | "
                      f"{wasted_space_str} de espacio desperdiciado")

        self.stats_label.config(text=stats_text)

    def format_file_size(self, size_bytes):
        if size_bytes == 0:
            return "0 B"

        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024
        return f"{size_bytes:.1f} TB"

    def hide_progress(self):
        self.progress.pack_forget()
        self.status_label.pack_forget()

    def show_context_menu(self, event):
        item = self.tree.selection()[0] if self.tree.selection() else None
        if item and self.tree.item(item)['values']:  # Solo para archivos, no grupos
            self.selected_item = item
            self.context_menu.post(event.x_root, event.y_root)

    def open_file(self):
        if hasattr(self, 'selected_item'):
            file_path = self.tree.item(self.selected_item)['values'][1]
            os.startfile(file_path)

    def show_in_explorer(self):
        if hasattr(self, 'selected_item'):
            file_path = self.tree.item(self.selected_item)['values'][1]
            os.system(f'explorer /select,"{file_path}"')

    def delete_file(self):
        if hasattr(self, 'selected_item'):
            file_path = self.tree.item(self.selected_item)['values'][1]
            file_name = os.path.basename(file_path)

            result = messagebox.askyesno(
                "Confirmar eliminación",
                f"¿Estás seguro de que quieres eliminar el archivo?\n\n{file_name}\n\nEsta acción no se puede deshacer."
            )

            if result:
                try:
                    os.remove(file_path)
                    self.tree.delete(self.selected_item)
                    messagebox.showinfo("Éxito", "Archivo eliminado correctamente")
                except Exception as e:
                    messagebox.showerror("Error", f"No se pudo eliminar el archivo:\n{str(e)}")

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    app = BookDuplicateDetector()
    app.run()